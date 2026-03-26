import { create } from "zustand";

interface PromptTemplate {
  id: string;
  name: string;
  description?: string;
  promptText: string;
  style: string;
  lighting?: string;
  mood?: string;
  action?: string;
  camera?: string;
  colorPalette?: string;
  aspectRatio: string;
  quality: string;
  negativePrompt?: string;
  exampleImage?: string;
}

interface PromptOverrides {
  lighting?: string;
  mood?: string;
  action?: string;
  camera?: string;
  colorPalette?: string;
}

interface GeneratorState {
  selectedTemplate: PromptTemplate | null;
  characterImages: string[];
  elementImages: string[];
  overrides: PromptOverrides;
  isGenerating: boolean;
  result: {
    imageUrl: string;
    prompt: string;
  } | null;
  error: string | null;
}

interface GeneratorActions {
  setSelectedTemplate: (template: PromptTemplate | null) => void;
  setCharacterImages: (images: string[]) => void;
  setElementImages: (images: string[]) => void;
  setOverrides: (overrides: PromptOverrides) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setResult: (result: { imageUrl: string; prompt: string } | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useGeneratorStore = create<GeneratorState & GeneratorActions>(
  (set) => ({
    selectedTemplate: null,
    characterImages: [],
    elementImages: [],
    overrides: {},
    isGenerating: false,
    result: null,
    error: null,
    setSelectedTemplate: (template) => set({ selectedTemplate: template }),
    setCharacterImages: (images) => set({ characterImages: images }),
    setElementImages: (images) => set({ elementImages: images }),
    setOverrides: (overrides) => set({ overrides }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    setResult: (result) => set({ result }),
    setError: (error) => set({ error }),
    reset: () =>
      set({
        selectedTemplate: null,
        characterImages: [],
        elementImages: [],
        overrides: {},
        isGenerating: false,
        result: null,
        error: null,
      }),
  })
);
