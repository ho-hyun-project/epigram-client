import { useCallback, useState } from 'react';

export default function useModal(
  initialState: boolean = false
): [boolean, { open: () => void; close: () => void }] {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);

  const close = useCallback(() => setIsOpen(false), []);

  return [isOpen, { open, close }];
}