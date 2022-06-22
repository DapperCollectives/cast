import React from 'react';
import ActionButton from 'components/ActionButton';
import StrategySelectorForm from 'components/Community/StrategySelectorForm';

// this object is used to change field names as are used
// on the backend
const fieldMapPayload = {
  contractAddress: 'addr',
  contractName: 'name',
  maxWeight: 'maxWeight',
  minimunBalance: 'threshold',
  strategy: 'name',
};
export default function CommunityProposalsAndVoting({
  communityVotingStrategies = [],
  updateCommunity,
  updatingCommunity,
} = {}) {
  // sends updates to backend
  const saveData = async (strategies) => {
    const updatePayload = strategies.map((st) => ({
      name: st.strategy,
      // only other strategies than 'one-address-one-vote' have contract information
      ...(st.strategy !== 'one-address-one-vote'
        ? {
            contracts: Object.assign(
              {},
              ...Object.entries(st).map(([key, value]) => ({
                ...(fieldMapPayload[key] && value
                  ? {
                      [fieldMapPayload[key]]: value,
                    }
                  : undefined),
              }))
            ),
          }
        : undefined),
    }));
    await updateCommunity({ strategies: updatePayload });
  };

  // used like this until backend returns strategies
  const st = communityVotingStrategies.map((st) => ({
    strategy: st,
  }));

  return (
    <StrategySelectorForm
      existingStrategies={st}
      disableAddButton={updatingCommunity}
      // st is an array with strategies hold by StrategySelector
      callToAction={(st) => (
        <ActionButton
          label="save"
          enabled={!updatingCommunity}
          onClick={() => saveData(st)}
          loading={updatingCommunity}
          classNames="mt-5"
        />
      )}
    />
  );
}
