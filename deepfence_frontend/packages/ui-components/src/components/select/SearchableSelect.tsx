import * as LabelPrimitive from '@radix-ui/react-label';
import * as Portal from '@radix-ui/react-portal';
import cx from 'classnames';
import { useCombobox, useMultipleSelection } from 'downshift';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { TextInput } from '@/components/input/TextInput';
import { fetchData } from '@/components/select/dummy';
import { CircleSpinner } from '@/main';

type SelectItem = { id: number; name: string };
export interface SearchableSelectProps {
  asMulti: boolean;
  name: string;
  label?: string;
  selectedItems: SelectItem[];
  required?: boolean;
  id?: string;
}

export const SearchableSelect = ({
  id,
  label,
  required,
  name,
}: SearchableSelectProps) => {
  const [inputValue, setInputValue] = useState('');
  const [offset, setOffset] = useState(1);
  const [selectItems, setSelectItems] = useState<SelectItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedItems, setSelectedItems] = useState<SelectItem[]>([]);

  const intersectionRef = useRef(null);

  const loadObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setOffset((_offset) => _offset + 1);
      }
    },
    {
      threshold: 1,
    },
  );

  const text = useMemo(() => {
    if (selectedItems.length === 0) {
      return null;
    }
    return selectedItems.length > 1
      ? `${selectedItems.length} items selected`
      : `${selectedItems.length} item selected`;
  }, [selectedItems]);

  useEffect(() => {
    if (intersectionRef.current) {
      loadObserver.observe(intersectionRef.current);
    }
    return () => {
      if (intersectionRef.current) {
        loadObserver.unobserve(intersectionRef.current);
      }
    };
  }, [intersectionRef.current]);

  const getApiData = (input: string) => {
    fetchData(offset, input).then((res: any[]) => {
      setSelectItems(res);
    });
  };

  useEffect(() => {
    fetchData(offset, searchText).then((res) => {
      setSelectItems((oldItems) => [...oldItems, ...res]);
    });
  }, [searchText, offset]);

  const getNewSelectItems = (newSelectedItem: SelectItem | null | undefined) => {
    const found = selectedItems.find((item) => item.id == newSelectedItem?.id);
    if (newSelectedItem) {
      if (!found) {
        return [...selectedItems, newSelectedItem];
      } else {
        return selectedItems.filter((item) => item.id !== newSelectedItem?.id);
      }
    }
    return selectedItems;
  };

  const { getDropdownProps } = useMultipleSelection({
    selectedItems,
  });

  const { isOpen, getMenuProps, getInputProps, getItemProps } = useCombobox({
    items: selectItems,
    itemToString(item) {
      return item ? item.name : '';
    },
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    stateReducer(state, actionAndChanges) {
      const { changes, type, inputValue } = actionAndChanges;

      if (inputValue) {
        setSearchText(inputValue);
      } else {
        setSearchText('');
      }
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep the menu open after selection.
          };
        default:
          return changes;
      }
    },
    onStateChange({ inputValue: newInputValue, type, selectedItem: newSelectedItem }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          setSelectedItems(getNewSelectItems(newSelectedItem));
          break;

        case useCombobox.stateChangeTypes.InputChange:
          getApiData(newInputValue ?? '');

          break;
        default:
          break;
      }
    },
  });

  const internalId = useId();
  const _id = id ? id : internalId;

  return (
    <div>
      <div className="flex flex-col gap-1">
        {label && (
          <LabelPrimitive.Root
            htmlFor={_id}
            className="text-sm font-medium text-gray-900 dark:text-white"
          >
            {required && <span>*</span>}
            {label}
          </LabelPrimitive.Root>
        )}
        <div className="shadow-sm bg-white inline-flex gap-2 items-center flex-wrap p-1.5">
          <span className="bg-gray-100 rounded-md px-1 focus:bg-red-400 mr-10">
            {text && <span className="pl-4 text-blue-500">{text}</span>}
          </span>

          <div className="flex gap-0.5 grow">
            <TextInput
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
              sizing="sm"
              name={name}
              value={text}
            />
          </div>
        </div>
      </div>
      <Portal.Root>
        <ul
          className={`absolute w-inherit bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 ${
            !(isOpen && selectItems.length) && 'hidden'
          }`}
          {...getMenuProps()}
        >
          {isOpen &&
            selectItems.map((item, index) => (
              <div key={index}>
                <li
                  className={cx('py-2 px-3 shadow-sm flex flex-col')}
                  key={`${item.id}${index}`}
                  {...getItemProps({ item, index })}
                >
                  <span
                    className={cx('text-sm text-gray-700', {
                      'text-blue-600 dark:text-blue-400': selectedItems.includes(item),
                    })}
                  >
                    {item.name}
                  </span>
                </li>
              </div>
            ))}
          <li ref={intersectionRef}>
            <CircleSpinner size="xs" />
          </li>
        </ul>
      </Portal.Root>
    </div>
  );
};

export default SearchableSelect;
