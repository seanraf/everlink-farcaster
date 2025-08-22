import React, { useState } from 'react';
import * as Label from '@radix-ui/react-label';
import type { DraggableItemProps, UrlButton, URLButtonsProps } from '../types';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Box } from '../components/Box';
import { TextField } from '../components/TextField';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
  KeyboardSensor,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

const SortableItem: React.FC<DraggableItemProps> = ({
  button,
  index,
  handleInputChange,
  handleDelete,
  error,
  urlButtonsLength,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const dragHandleRef = React.useRef<HTMLDivElement | null>(null);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({
    id: button.id,
  });

  React.useEffect(() => {
    if (dragHandleRef.current) {
      setActivatorNodeRef(dragHandleRef.current);
    }
  }, [setActivatorNodeRef]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    width: '100%',
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className='flex w-full border border-gray-200 my-2 px-4 py-4 rounded-lg gap-4 bg-white'
    >
      <Box
        ref={dragHandleRef}
        {...listeners}
        style={{ touchAction: 'none' }}
        className='flex items-center cursor-grab select-none'
      >
        <img
          src={'/DragIcon.svg'}
          alt='Drag Icon'
          height={18}
          width={12}
          draggable='false'
        />
      </Box>
      <Box
        className='flex flex-1 direction-row-column gap-4 relative'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box className='flex-1'>
          <Label.Root className='block text-gray-600 font-medium mb-1'>
            Button Label
          </Label.Root>
          <TextField
            id={`button-title-${button.id}`}
            label=''
            value={button.title}
            onChange={(e) => handleInputChange(e, index, 'title')}
            error={error?.title}
          />
        </Box>
        <Box className='flex-1'>
          <Label.Root className='block text-gray-600 font-medium mb-1'>
            URL
          </Label.Root>
          <TextField
            id={`button-url-${button.id}`}
            label=''
            value={button.url}
            onChange={(e) => handleInputChange(e, index, 'url')}
            error={error?.url}
          />
        </Box>

        {urlButtonsLength > 1 && (
          <>
            <button
              type='button'
              className={`border-0 bg-transparent  items-center justify-center text-red-500 hover:bg-red-50 w-6 h-6 cursor-pointer
                ${isHovered ? 'display-md-dragable-del-button' : 'hidden'} ${
                urlButtonsLength > 1 ? 'flex' : 'hidden'
              } md:relative`}
              style={{ marginTop: '39px' }}
              onClick={() => handleDelete(index)}
              tabIndex={-1}
            >
              <img src='/DeleteIcon.svg' alt='Delete' className='w-6 h-6' />
            </button>
          </>
        )}
        {urlButtonsLength > 1 && (
          <>
            <button
              type='button'
              className={`absolute right-0 display-xs-dragable-del-button top-0 border-0 bg-transparent md:static md:ml-2 flex items-center justify-center text-red-500 hover:bg-red-50 w-6 h-6
                ${isHovered ? 'md:flex' : 'md:hidden'} ${
                urlButtonsLength > 1 ? 'flex' : 'hidden'
              } md:relative`}
              onClick={() => handleDelete(index)}
              tabIndex={-1}
            >
              <img src='/DeleteIcon.svg' alt='Delete' className='w-5 h-5' />
            </button>
          </>
        )}
      </Box>
    </div>
  );
};

const URLButtons: React.FC<URLButtonsProps> = ({
  urlButtons,
  setUrlButtons,
  urlButtonErrors,
  setUrlButtonErrors,
}) => {
  const [activeId, setActiveId] = React.useState<string | null>(null); // Track active drag item
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    if (active.id !== over?.id) {
      const oldIndex = urlButtons.findIndex((btn) => btn.id === active.id);
      const newIndex = urlButtons.findIndex((btn) => btn.id === over?.id);
      const updated = arrayMove(urlButtons, oldIndex, newIndex);
      setUrlButtons(updated);
    }
  };

  const activeItem = urlButtons.find((btn) => btn.id === activeId);

  const validateButtonTitle = (title: string): string => {
    if (!title.trim()) {
      return 'Please enter button label';
    }
    return '';
  };

  const validateButtonUrl = (url: string): string => {
    if (!url) {
      return 'Please enter button URL';
    }
    if (url === 'https://' || url.startsWith('https://https://')) {
      return 'Please enter a valid button URL';
    }
    const urlPattern = /^(https?|ftp|ws):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}.*$/;
    if (!urlPattern.test(url)) {
      return 'Please enter a valid button URL';
    }
    return '';
  };

  const addButton = () => {
    const newButton: UrlButton = {
      id: `${urlButtons.length + 1}-${Date.now()}`,
      title: '',
      url: 'https://',
    };
    setUrlButtons([...urlButtons, newButton]);
    setUrlButtonErrors([
      ...urlButtonErrors,
      {
        id: newButton.id,
        title: validateButtonTitle(''),
        url: validateButtonUrl('https://'),
      },
    ]);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: string
  ) => {
    const value = e.target.value;
    const updatedButtons = [...urlButtons];
    updatedButtons[index] = {
      ...updatedButtons[index],
      [field]: value,
    };
    setUrlButtons(updatedButtons);
    const updatedErrors = [...urlButtonErrors];
    if (field === 'title') {
      updatedErrors[index] = {
        ...updatedErrors[index],
        title: validateButtonTitle(value),
      };
    } else if (field === 'url') {
      updatedErrors[index] = {
        ...updatedErrors[index],
        url: validateButtonUrl(value),
      };
    }
    setUrlButtonErrors(updatedErrors);
  };

  const handleDelete = (index: number) => {
    const updatedButtons = urlButtons.filter((_, i) => i !== index);
    const updatedErrors = urlButtonErrors.filter((_, i) => i !== index);
    setUrlButtons(updatedButtons);
    setUrlButtonErrors(updatedErrors);
  };

  return (
    <Box className='cursor-default'>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={urlButtons.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {urlButtons.map((button, index) => (
            <SortableItem
              key={button.id}
              index={index}
              button={button}
              handleInputChange={handleInputChange}
              handleDelete={handleDelete}
              error={urlButtonErrors[index]}
              urlButtonsLength={urlButtons.length}
              moveButton={() => {}}
            />
          ))}
        </SortableContext>
        <DragOverlay
          adjustScale={false}
          dropAnimation={{
            duration: 300,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 0.99)',
          }}
        >
          {activeId ? (
            <Box className='flex w-full border border-gray-200 my-2 px-4 py-4 rounded-lg gap-4 bg-white opacity-80 cursor-grabbing'>
              <Box className='flex items-center'>
                <img
                  src={'/DragIcon.svg'}
                  alt='Drag Icon'
                  className='h-4 w-3'
                />
              </Box>
              <Box className='flex-1 flex direction-row-column gap-4'>
                <Box className='flex-1'>
                  <Label.Root className='block text-gray-500 font-medium mb-1'>
                    Button Label
                  </Label.Root>
                  <TextField
                    id={`drag-title-${activeItem?.id}`}
                    label=''
                    value={activeItem!.title}
                    onChange={() => {}}
                    error={undefined}
                    disabled
                  />
                </Box>
                <Box className='flex-1'>
                  <Label.Root className='block text-gray-500 font-medium mb-1'>
                    URL
                  </Label.Root>
                  <TextField
                    id={`drag-url-${activeItem?.id}`}
                    label=''
                    value={activeItem!.url}
                    onChange={() => {}}
                    error={undefined}
                    disabled
                  />
                </Box>
              </Box>
            </Box>
          ) : null}
        </DragOverlay>

        <Box className='flex justify-end mt-4'>
          <button
            type='button'
            className='flex items-center gap-1 cursor-pointer bg-transparent border-0 font-bold'
            onClick={addButton}
          >
            <svg width='20' height='20' fill='none' viewBox='0 0 24 24'>
              <path
                d='M12 5v14m7-7H5'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
            Add Button
          </button>
        </Box>
      </DndContext>
    </Box>
  );
};

export default URLButtons;
