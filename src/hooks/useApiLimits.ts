import { useState, useEffect } from 'react';

interface ModelGenerationTime {
  modelId: string;
  timestamps: Date[];
}

export const useApiLimits = () => {
  const [modelGenerationTimes, setModelGenerationTimes] = useState<ModelGenerationTime[]>([]);
  const [textGenerationTimes, setTextGenerationTimes] = useState<Date[]>([]);

  // Clean up old timestamps every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const oneMinuteAgo = new Date(Date.now() - 60000);
      
      // Clean image generation timestamps
      setModelGenerationTimes(prev => 
        prev.map(model => ({
          ...model,
          timestamps: model.timestamps.filter(time => time > oneMinuteAgo)
        }))
      );

      // Clean text generation timestamps
      setTextGenerationTimes(prev => 
        prev.filter(time => time > oneMinuteAgo)
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const checkImageGenerationLimit = (modelId: string): boolean => {
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const currentModelTimes = modelGenerationTimes.find(m => m.modelId === modelId);
    const recentGenerations = currentModelTimes?.timestamps.filter(time => time > oneMinuteAgo) || [];
    return recentGenerations.length < 3;
  };

  const checkTextGenerationLimit = (): boolean => {
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const recentGenerations = textGenerationTimes.filter(time => time > oneMinuteAgo);
    return recentGenerations.length < 5; // 5 istek/dakika limiti
  };

  const recordImageGeneration = (modelId: string) => {
    setModelGenerationTimes(prev => {
      const modelIndex = prev.findIndex(m => m.modelId === modelId);
      if (modelIndex === -1) {
        return [...prev, { modelId, timestamps: [new Date()] }];
      }
      return prev.map(model => 
        model.modelId === modelId
          ? { ...model, timestamps: [...model.timestamps, new Date()] }
          : model
      );
    });
  };

  const recordTextGeneration = () => {
    setTextGenerationTimes(prev => [...prev, new Date()]);
  };

  return {
    checkImageGenerationLimit,
    checkTextGenerationLimit,
    recordImageGeneration,
    recordTextGeneration,
  };
};