```typescript
import React, { FC } from 'react';

type ButtonProps = {
  text: string;
  onClick: () => void;
};

const Button: FC<ButtonProps> = ({ text, onClick }) => {
  return <button onClick={onClick}>{text}</button>;
};

export default Button;
```