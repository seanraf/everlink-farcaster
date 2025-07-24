import type { JSX } from "react";

export type UrlButton = {
    id: string;
    title: string;
    url: string;
  };
  
  export type UrlButtonErrors = {
    id: string;
    title: string;
    url: string;
  };
  
  export type ThemeCards = { id: string; themeName: string; theme: JSX.Element };
  
  export type URLButtonsProps = {
    urlButtons: UrlButton[];
    setUrlButtons: React.Dispatch<React.SetStateAction<UrlButton[]>>;
    urlButtonErrors: UrlButtonErrors[];
    setUrlButtonErrors: React.Dispatch<React.SetStateAction<UrlButtonErrors[]>>;
  };
  
  export type DraggableItemProps = {
    button: UrlButton;
    index: number;
    moveButton: (fromIndex: number, toIndex: number) => void;
    handleInputChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      index: number,
      field: string
    ) => void;
    handleDelete: (index: number) => void;
    error: { title: string; url: string };
    urlButtonsLength: number;
  };
  
  export type SelectThemeProps = {
    selectedTheme: string;
    setSelectedTheme: React.Dispatch<React.SetStateAction<string>>;
  };
  
  export type UploaderProps = {
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    selectedTheme: string;
    userName: string;
    bio: string;
    urlButtons: UrlButton[];
    setDeploymentTaskId: React.Dispatch<React.SetStateAction<string>>;
    setSnackbar: React.Dispatch<
      React.SetStateAction<{
        open: boolean;
        message: string;
        severity: 'error' | 'success';
      }>
    >;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  };
  
  export type DomainContent = {
    domainList: string[];
    taskId: string;
  };
  
  export type MinterProps = {
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    renderThemePreview: () => JSX.Element;
    deploymentTaskId: string;
    loading: boolean;
  };
  
  export type FrameContextType = {
    user: {
      fid: number;
      username?: string;
      displayName?: string;
      pfpUrl?: string;
      location?: { placeId?: string; description?: string };
    };
    client: {
      clientFid: number;
      added: boolean;
    };
  };
  
  export type ContextType = {
    context: FrameContextType | undefined;
    setContext: React.Dispatch<
      React.SetStateAction<FrameContextType | undefined>
    >;
  };
  