import * as SelectPrimitive from '@radix-ui/react-select';
import cx from 'classnames';
import { useCombobox, useMultipleSelection, useSelect } from 'downshift';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export interface SelectProps extends SelectPrimitive.SelectProps {
  // Trigger passed as children
  children: React.ReactNode;
  content: React.ReactNode;
  // Content that will actually be rendered in the select
  // pass true if you want to merge passed children with default trigger button
  triggerAsChild?: boolean;
}

const books = Array.from(Array(100).keys()).map((i) => ({
  author: 'Harper Lee ' + i,
  title: 'To Kill a Mockingbird ' + i,
}));

function getFilteredBooks(
  selectedItems: { author: string; title: string },
  inputValue: string,
) {
  const lowerCasedInputValue = inputValue.toLowerCase();

  return books.filter(function filterBook(book) {
    return (
      // !selectedItems.includes(book) &&
      book.title.toLowerCase().includes(lowerCasedInputValue) ||
      book.author.toLowerCase().includes(lowerCasedInputValue)
    );
  });
}

const fetchData = async (offset: number, searchText) => {
  if (searchText) {
    const data = await new Promise((resolve) => {
      const b = books.find((book) => book.title.includes(searchText));
      resolve(b ? [b] : []);
    });
    return data;
  } else {
    const data = await new Promise((resolve) => {
      resolve(Object.values(books.slice(0, offset + 5)));
    });
    return data ?? [];
  }
};
export const FlexibleSelect = (props: SelectProps) => {
  const { children, content, triggerAsChild } = props;

  const initialSelectedItems = [];

  // const [inputValue, setInputValue] = useState('');
  // const [selectedItems, setSelectedItems] = useState(initialSelectedItems);

  // const {
  //   isOpen,
  //   selectedItem,
  //   getToggleButtonProps,
  //   getLabelProps,
  //   getMenuProps,
  //   highlightedIndex,
  //   getItemProps,
  // } = useSelect({ items });

  const [inputValue, setInputValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [items, setItems] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
  // const items = useMemo(
  //   () => getFilteredBooks(selectedItems, inputValue),
  //   [selectedItems, inputValue],
  // );

  const intersectionRef = useRef(null);

  const loadObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      debugger;
      if (entry.isIntersecting) {
        setOffset((_offset) => _offset + 5);
      }
    },
    {
      threshold: 1,
    },
  );

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

  useEffect(() => {
    debugger;
    if (searchText) {
      fetchData(offset, searchText).then((res) => {
        setItems(res);
      });
    } else {
      fetchData(offset, '').then((res) => {
        setItems(res);
      });
    }
  }, [searchText, offset]);

  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
    useMultipleSelection({
      selectedItems,
      onStateChange({ selectedItems: newSelectedItems, type }) {
        switch (type) {
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            setSelectedItems(newSelectedItems);
            break;
          default:
            break;
        }
      },
    });

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items: items ?? [],
    itemToString(item) {
      return item ? item.title : '';
    },
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    stateReducer(state, actionAndChanges) {
      const { changes, type, inputValue } = actionAndChanges;

      if (inputValue) {
        setSearchText(inputValue);
        return changes;
      } else {
        setSearchText('');
        return changes;
      }
      // switch (type) {
      //   case useCombobox.stateChangeTypes.InputKeyDownEnter:
      //   case useCombobox.stateChangeTypes.ItemClick:
      //     return {
      //       ...changes,
      //       isOpen: true, // keep the menu open after selection.
      //       highlightedIndex: 0, // with the first option highlighted.
      //     };
      //   default:
      //     return changes;
      // }
    },
    onStateChange({ inputValue: newInputValue, type, selectedItem: newSelectedItem }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (newSelectedItem) {
            setSelectedItems([...selectedItems, newSelectedItem]);
          }
          break;

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue('');

          break;
        default:
          break;
      }
    },
  });

  return (
    // <SelectPrimitive.Root>
    //   <SelectPrimitive.Trigger asChild={triggerAsChild}>
    //     {children}
    //   </SelectPrimitive.Trigger>
    //   <SelectPrimitive.Portal>
    //     <SelectPrimitive.Content>{content}</SelectPrimitive.Content>
    //   </SelectPrimitive.Portal>
    // </SelectPrimitive.Root>
    <div>
      {/* <label {...getLabelProps()}>Choose an element:</label> */}
      {/* <div {...getToggleButtonProps()}>{selectedItem ?? 'Elements'}</div> */}

      {/* <ul {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <li key={`${item}${index}`} {...getItemProps({ item, index })}>
              {item}
            </li>
          ))}
      </ul> */}

      <div className="flex flex-col gap-1">
        <label className="w-fit" {...getLabelProps()}>
          Pick some books:
        </label>
        <div className="shadow-sm bg-white inline-flex gap-2 items-center flex-wrap p-1.5">
          {/* {selectedItems.map(function renderSelectedItem(selectedItemForRender, index) {
            return (
              <span
                className="bg-gray-100 rounded-md px-1 focus:bg-red-400"
                key={`selected-item-${index}`}
                {...getSelectedItemProps({
                  selectedItem: selectedItemForRender,
                  index,
                })}
              >
                {selectedItemForRender.title}
                <span
                  className="px-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedItem(selectedItemForRender);
                  }}
                >
                  &#10005;
                </span>
              </span>
            );
          })} */}
          <span className="bg-gray-100 rounded-md px-1 focus:bg-red-400 mr-10">
            {selectedItems && selectedItems.length > 1 && selectedItems[0].title}
            {selectedItems && selectedItems.length > 1 && (
              <span className="pl-4 text-blue-500">+{selectedItems.length - 1} more</span>
            )}
          </span>

          <div className="flex gap-0.5 grow">
            <input
              placeholder="Search here..."
              className="w-full"
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
            />
            <button
              aria-label="toggle menu"
              className="px-2"
              type="button"
              {...getToggleButtonProps()}
            >
              &#8595;
            </button>
          </div>
        </div>
      </div>

      <ul
        className={`absolute w-inherit bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 ${
          !(isOpen && items.length) && 'hidden'
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          items.map((item, index) => (
            <div key={index}>
              <li
                className={cx('py-2 px-3 shadow-sm flex flex-col', {
                  'bg-blue-300': selectedItems.includes(item),
                  // selectedItem === item && 'font-bold',
                })}
                key={`${item.value}${index}`}
                {...getItemProps({ item, index })}
              >
                <span>{item.title}</span>
                <span className="text-sm text-gray-700">{item.author}</span>
              </li>
            </div>
          ))}
        <li ref={intersectionRef}>Load</li>
      </ul>
    </div>
  );
};

export const FlexibleSelectItem: React.ForwardRefExoticComponent<
  SelectPrimitive.SelectItemProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef((props, forwardedRef) => {
  const { children, className, ...rest } = props;
  const classes = twMerge(
    cx(
      'flex px-4 py-2.5 items-center gap-3 text-gray-500 dark:text-gray-300 cursor-pointer',
      'focus:outline-none dark:focus:bg-gray-600 focus:bg-gray-100',
      'text-sm font-medium',
    ),
    className,
  );
  return (
    <SelectPrimitive.Item className={classes} {...rest} ref={forwardedRef}>
      {children}
    </SelectPrimitive.Item>
  );
});
