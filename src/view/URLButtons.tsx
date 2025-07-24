import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputLabel,
  Grid,
  Typography,
  IconButton,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import type { DraggableItemProps, UrlButton, URLButtonsProps } from '../types';
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
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

const styles = {
  dragIcon: {
    my: 'auto',
    display: 'flex',
  },
  textField: {
    mt: 1,
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#F8F8F8',
      borderTopRightRadius: '8px',
      borderBottomRightRadius: '8px',
      '& fieldset': {
        borderColor: '#CBD2E0',
        borderRadius: '8px',
      },
      '&:hover fieldset': {
        borderColor: '#CBD2E0',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#CBD2E0',
      },
    },
  },
  dragItemOuterBox: {
    display: 'flex',
    width: '100%',
    border: '1px solid #E7EAEF',
    my: 1.5,
    px: 2,
    py: 2.2,
    borderRadius: '8px',
    gap: 1.5,
    cursor: 'default',
  },
  addButtonSection: {
    display: 'flex',
    justifyContent: 'end',
    mt: 2,
  },
  addButtonBox: {
    display: 'flex',
    cursor: 'pointer',
  },
  addRoundedIcon: {
    width: '20px',
    height: '20px',
    my: 'auto',
    color: 'text.secondary',
  },
  addButton: {
    fontSize: { sm: 16, xs: 14 },
    fontWeight: 'bold',
    color: 'text.secondary',
  },
  inputLabel: {
    color: 'text.secondary',
    fontWeight: 500,
    fontSize: { md: 16, xs: 14 },
    '& .MuiTypography-root': { fontSize: { md: 16, xs: 14 } },
  },
  iconButtonforLarge: {
    color: 'red',
    width: 36,
    height: 36,
  },
  iconButtonforSmall: {
    color: 'red',
    position: 'absolute',
    right: 5,
    bottom: 0,
    top: 0,
  },
};

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
    <div ref={setNodeRef} style={style} {...attributes}>
      <Box sx={styles.dragItemOuterBox}>
        <Box
          sx={{
            ...styles.dragIcon,
            cursor: 'grab',
            '&:active': {
              cursor: 'grabbing',
            },
          }}
          ref={dragHandleRef}
          {...listeners}
          style={{ touchAction: 'none' }}
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
          sx={{ display: 'flex', width: '100%' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Grid
            container
            spacing={2}
            style={{ position: 'relative', width: '100%' }}
          >
            <Grid size={{ md: 6, xs: 12 }}>
              <Box>
                <InputLabel sx={styles.inputLabel}>
                  <Box sx={{ display: 'flex', position: 'relative' }}>
                    <Typography>Button Label</Typography>
                    <IconButton
                      edge='end'
                      sx={{
                        ...styles.iconButtonforSmall,
                        display: {
                          md: 'none',
                          xs: urlButtonsLength === 1 ? 'none' : 'flex',
                        },
                      }}
                    >
                      <img
                        src={'/DeleteIcon.svg'}
                        alt='Delete'
                        width={20}
                        height={20}
                        onClick={() => handleDelete(index)}
                      />
                    </IconButton>
                  </Box>
                </InputLabel>
                <TextField
                  InputProps={{
                    inputProps: {
                      style: {
                        padding: '0 10px',
                        height: '48px',
                        width: '100%',
                        backgroundColor: '#F8F8F8',
                      },
                    },
                  }}
                  sx={styles.textField}
                  value={button.title}
                  onChange={(e) => handleInputChange(e, index, 'title')}
                  required
                  fullWidth
                  variant='outlined'
                  error={!!error?.title}
                  helperText={error?.title}
                />
              </Box>
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <Box>
                <InputLabel sx={styles.inputLabel}>URL</InputLabel>
                <TextField
                  InputProps={{
                    inputProps: {
                      style: {
                        padding: '0 10px',
                        height: '48px',
                        width: '100%',
                        backgroundColor: '#F8F8F8',
                      },
                    },
                  }}
                  sx={styles.textField}
                  value={button.url}
                  onChange={(e) => handleInputChange(e, index, 'url')}
                  required
                  fullWidth
                  variant='outlined'
                  error={!!error?.url}
                  helperText={error?.url}
                />
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: {
                md: isHovered && urlButtonsLength !== 1 ? 'flex' : 'none',
                xs: 'none',
              },
              mt: '37px',
              ml: 1,
            }}
          >
            <IconButton edge='end' sx={styles.iconButtonforLarge}>
              <img
                src={'/DeleteIcon.svg'}
                alt='Delete'
                width={24}
                height={24}
                onClick={() => handleDelete(index)}
              />
            </IconButton>
          </Box>
        </Box>
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
    <Box sx={{ cursor: 'default' }}>
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
            <Box
              sx={{
                ...styles.dragItemOuterBox,
                cursor: 'grabbing',
              }}
              bgcolor={'#ffffff'}
            >
              <Box sx={styles.dragIcon}>
                <img
                  src={'/DragIcon.svg'}
                  alt='Drag Icon'
                  height={18}
                  width={12}
                />
              </Box>
              <Box width={'100%'} sx={{ display: 'flex' }}>
                <Grid
                  container
                  spacing={2}
                  style={{ position: 'relative', width: '100%' }}
                >
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Box>
                      <InputLabel
                        htmlFor='input-with-icon-adornment'
                        sx={styles.inputLabel}
                      >
                        <Box sx={{ display: 'flex' }}>
                          <Typography>Button Label</Typography>
                        </Box>
                      </InputLabel>
                      <TextField
                        InputProps={{
                          inputProps: {
                            style: {
                              padding: '0 10px',
                              height: '48px',
                              width: '100%',
                              backgroundColor: '#F8F8F8',
                            },
                          },
                        }}
                        sx={styles.textField}
                        value={activeItem?.title}
                        fullWidth
                        id='outlined-basic'
                        variant='outlined'
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Box>
                      <InputLabel
                        htmlFor='input-with-icon-adornment'
                        sx={styles.inputLabel}
                      >
                        URL
                      </InputLabel>
                      <Box>
                        <TextField
                          InputProps={{
                            inputProps: {
                              style: {
                                padding: '0 10px',
                                height: '48px',
                                width: '100%',
                                backgroundColor: '#F8F8F8',
                              },
                            },
                          }}
                          sx={styles.textField}
                          value={activeItem?.url}
                          required
                          fullWidth
                          id='outlined-basic'
                          variant='outlined'
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          ) : null}
        </DragOverlay>

        <Box sx={styles.addButtonSection}>
          <Box sx={styles.addButtonBox} onClick={addButton}>
            <AddRoundedIcon sx={styles.addRoundedIcon} />
            <Typography sx={styles.addButton}>Add Button</Typography>
          </Box>
        </Box>
      </DndContext>
    </Box>
  );
};

export default URLButtons;
