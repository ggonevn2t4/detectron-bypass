
import { useState, createContext, useContext, ReactNode } from 'react';
import { OpenRouterModel } from '@/services/ai';

export type AIProvider = 'deepseek' | 'openrouter';

interface ModelSelection {
  humanizer: OpenRouterModel;
  detector: OpenRouterModel;
  writer: OpenRouterModel;
  translator: OpenRouterModel;
}

interface AIProviderContextType {
  provider: AIProvider;
  setProvider: (provider: AIProvider) => void;
  selectedModels: ModelSelection;
  setModelForService: (service: keyof ModelSelection, model: OpenRouterModel) => void;
}

const defaultModels: ModelSelection = {
  humanizer: OpenRouterModel.GPT4O,
  detector: OpenRouterModel.GPT4O,
  writer: OpenRouterModel.GPT4O_MINI,
  translator: OpenRouterModel.GPT4O_MINI
};

const AIProviderContext = createContext<AIProviderContextType>({
  provider: 'deepseek',
  setProvider: () => {},
  selectedModels: defaultModels,
  setModelForService: () => {}
});

export const AIProviderProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<AIProvider>('deepseek');
  const [selectedModels, setSelectedModels] = useState<ModelSelection>(defaultModels);

  const setModelForService = (service: keyof ModelSelection, model: OpenRouterModel) => {
    setSelectedModels(prev => ({
      ...prev,
      [service]: model
    }));
  };

  return (
    <AIProviderContext.Provider 
      value={{ 
        provider, 
        setProvider, 
        selectedModels, 
        setModelForService 
      }}
    >
      {children}
    </AIProviderContext.Provider>
  );
};

export const useAIProvider = () => useContext(AIProviderContext);
