package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"testing"

	"github.com/DapperCollectives/CAST/backend/main/models"
	"github.com/DapperCollectives/CAST/backend/main/shared"
	"github.com/DapperCollectives/CAST/backend/main/test_utils"
	utils "github.com/DapperCollectives/CAST/backend/main/test_utils"
	"github.com/stretchr/testify/assert"
)

/*********************/
/*     COMMUNITIES   */
/*********************/

func TestEmptyCommunityTable(t *testing.T) {
	clearTable("communities")

	req, _ := http.NewRequest("GET", "/communities", nil)
	response := executeRequest(req)

	checkResponseCode(t, http.StatusOK, response.Code)
	var body shared.PaginatedResponse
	json.Unmarshal(response.Body.Bytes(), &body)

	if body.Count != 0 {
		t.Errorf("Expected empty body. Got count of %d", body.Count)
	}
}

func TestGetNonExistentCommunity(t *testing.T) {
	clearTable("communities")

	response := otu.GetCommunityAPI(420)
	checkResponseCode(t, http.StatusNotFound, response.Code)

	var m map[string]string
	json.Unmarshal(response.Body.Bytes(), &m)

	assert.Equal(t, "Community not found", m["error"])
}

func TestCreateCommunity(t *testing.T) {
	// Prep
	clearTable("communities")
	clearTable("community_users")

	// Create Community
	communityStruct := otu.GenerateCommunityStruct("account")
	communityPayload := otu.GenerateCommunityPayload("account", communityStruct)
	response := otu.CreateCommunityAPI(communityPayload)
	fmt.Printf("RESPONSE %+v \n", response.Body)

	// Check response code
	checkResponseCode(t, http.StatusCreated, response.Code)

	// Parse
	var community models.Community
	json.Unmarshal(response.Body.Bytes(), &community)

	// Validate
	assert.Equal(t, utils.DefaultCommunity.Name, community.Name)
	assert.Equal(t, utils.DefaultCommunity.Body, community.Body)
	assert.Equal(t, utils.DefaultCommunity.Logo, community.Logo)
	assert.NotNil(t, community.ID)
}

func TestCommunityAdminRoles(t *testing.T) {
	clearTable("communities")
	clearTable("community_users")

	//CreateCommunity
	communityStruct := otu.GenerateCommunityStruct("account")
	communityPayload := otu.GenerateCommunityPayload("account", communityStruct)

	response := otu.CreateCommunityAPI(communityPayload)
	checkResponseCode(t, http.StatusCreated, response.Code)

	// Parse Community
	var community models.Community
	json.Unmarshal(response.Body.Bytes(), &community)

	response = otu.GetCommunityUsersAPI(community.ID)
	checkResponseCode(t, http.StatusOK, response.Code)

	var p test_utils.PaginatedResponseWithUserType
	json.Unmarshal(response.Body.Bytes(), &p)

	//Admin user has all possible roles
	assert.Equal(t, true, p.Data[0].Is_admin)
	assert.Equal(t, true, p.Data[0].Is_author)
	assert.Equal(t, true, p.Data[0].Is_member)
}

func TestCommunityAuthorRoles(t *testing.T) {
	clearTable("communities")
	clearTable("community_users")

	//CreateCommunity
	communityStruct := otu.GenerateCommunityStruct("account")
	communityPayload := otu.GenerateCommunityPayload("account", communityStruct)

	response := otu.CreateCommunityAPI(communityPayload)
	checkResponseCode(t, http.StatusCreated, response.Code)

	// Parse Community
	var community models.Community
	json.Unmarshal(response.Body.Bytes(), &community)

	//Generate the user, admin must be the signer
	userStruct := otu.GenerateCommunityUserStruct("user1", "author")
	userPayload := otu.GenerateCommunityUserPayload("account", userStruct)

	response = otu.CreateCommunityUserAPI(community.ID, userPayload)
	checkResponseCode(t, http.StatusCreated, response.Code)

	// Query the community
	response = otu.GetCommunityUsersAPI(community.ID)
	checkResponseCode(t, http.StatusOK, response.Code)

	var p test_utils.PaginatedResponseWithUserType
	json.Unmarshal(response.Body.Bytes(), &p)

	assert.Equal(t, false, p.Data[0].Is_admin)
	assert.Equal(t, true, p.Data[0].Is_author)
	assert.Equal(t, true, p.Data[0].Is_member)
}

func TestGetCommunityAPI(t *testing.T) {
	clearTable("communities")
	clearTable("community_users")
	otu.AddCommunities(1)

	response := otu.GetCommunityAPI(1)

	checkResponseCode(t, http.StatusOK, response.Code)
}

func TestUpdateCommunity(t *testing.T) {
	clearTable("communities")
	clearTable("community_users")

	// Create Community
	communityStruct := otu.GenerateCommunityStruct("account")
	communityPayload := otu.GenerateCommunityPayload("account", communityStruct)
	response := otu.CreateCommunityAPI(communityPayload)
	fmt.Printf("RESPONSE %+v \n", response.Body)

	// Check response code
	checkResponseCode(t, http.StatusCreated, response.Code)

	// Fetch community to compare updated version against
	response = otu.GetCommunityAPI(1)

	// Get the original community from the API
	var oldCommunity models.Community
	json.Unmarshal(response.Body.Bytes(), &oldCommunity)

	// Update some fields
	payload := otu.GenerateCommunityPayload("account", &utils.UpdatedCommunity)
	fmt.Printf("\n payload to be updated %+v \n :", payload.Strategies)

	response = otu.UpdateCommunityAPI(oldCommunity.ID, payload)
	fmt.Printf("RESPONSE %+v \n", response.Body)
	checkResponseCode(t, http.StatusOK, response.Code)

	// Get community again for assertions
	response = otu.GetCommunityAPI(oldCommunity.ID)
	var updatedCommunity models.Community
	json.Unmarshal(response.Body.Bytes(), &updatedCommunity)

	fmt.Printf("\n UPDATED COMMUNITY %+v \n", updatedCommunity.Strategies)
	fmt.Printf("\n UTILS.UPDATED COMMUNITY %+v \n", *utils.UpdatedCommunity.Strategies)

	assert.Equal(t, oldCommunity.ID, updatedCommunity.ID)
	assert.Equal(t, utils.UpdatedCommunity.Name, updatedCommunity.Name)
	assert.Equal(t, *utils.UpdatedCommunity.Logo, *updatedCommunity.Logo)
	assert.Equal(t, *utils.UpdatedCommunity.Strategies, *updatedCommunity.Strategies)
	assert.Equal(t, *utils.UpdatedCommunity.Banner_img_url, *updatedCommunity.Banner_img_url)
	assert.Equal(t, *utils.UpdatedCommunity.Website_url, *updatedCommunity.Website_url)
	assert.Equal(t, *utils.UpdatedCommunity.Twitter_url, *updatedCommunity.Twitter_url)
	assert.Equal(t, *utils.UpdatedCommunity.Github_url, *updatedCommunity.Github_url)
	assert.Equal(t, *utils.UpdatedCommunity.Discord_url, *updatedCommunity.Discord_url)
	assert.Equal(t, *utils.UpdatedCommunity.Instagram_url, *updatedCommunity.Instagram_url)
}

// func TestUpdateStrategies(t *testing.T) {
// 	clearTable("communities")
// 	clearTable("community_users")

// 	communityStruct := otu.GenerateCommunityStruct("account")
// 	communityPayload := otu.GenerateCommunityPayload("account", communityStruct)
// 	response := otu.CreateCommunityAPI(communityPayload)

// 	// Check response code
// 	checkResponseCode(t, http.StatusCreated, response.Code)

// 	// Fetch community to compare updated version against
// 	response = otu.GetCommunityAPI(1)

// 	// Get the original community from the API
// 	var oldCommunity models.Community
// 	json.Unmarshal(response.Body.Bytes(), &oldCommunity)

// }
