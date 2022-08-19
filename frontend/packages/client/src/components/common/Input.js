import React from 'react';
import FadeIn from 'components/FadeIn';

export default function Input({
  style = {},
  classNames = '',
  name,
  placeholder = '',
  register,
  disabled,
  error,
  type = 'text',
} = {}) {
  return (
    <div className="is-flex is-flex-direction-column flex-1">
      <input
        type={type}
        style={{ width: '100%', ...style }}
        placeholder={placeholder}
        className={classNames}
        {...register(name, { disabled })}
      />
      {error && (
        <FadeIn>
          <div className="pl-1 mt-2">
            <p className="smaller-text has-text-red">{error?.message}</p>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
