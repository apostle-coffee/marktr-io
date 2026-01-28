import { useCallback, useState } from "react";
import {
  generateICPProfile,
  generateICPInsights,
  generateICPAvatar,
  type ICPProfile,
  type ICPInsights,
  type ICPAvatarResult,
  type ICPSeedInput,
} from "../services/icpAiService";

export interface GeneratedICPBundle {
  profile: ICPProfile;
  insights: ICPInsights;
  avatar: ICPAvatarResult;
}

/**
 * useICPAi
 *
 * Central hook for running the full AI pipeline for an ICP:
 *  - Structured ICP profile
 *  - Personality / insight summary
 *  - Avatar image URL
 *
 * You can call this from your onboarding / "Create ICP" flow.
 *
 * Example usage (pseudocode inside a component):
 *
 *   const { generateAll, isLoading, error } = useICPAi();
 *
 *   const handleGenerate = async () => {
 *     const result = await generateAll({
 *       workingTitle,
 *       notes,
 *       industry,
 *       companySize,
 *       tone: "playful",
 *     });
 *
 *     // result.profile, result.insights, result.avatar.imageUrl
 *   };
 */
export function useICPAi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAll = useCallback(
    async (seed: ICPSeedInput): Promise<GeneratedICPBundle> => {
      setIsLoading(true);
      setError(null);

      try {
        // You could run profile + insights in parallel if you like,
        // but keeping it sequential for now is easier to debug.
        const profile = await generateICPProfile(seed);
        const insights = await generateICPInsights(seed);
        const avatar = await generateICPAvatar(seed);

        const bundle: GeneratedICPBundle = { profile, insights, avatar };

        console.debug("[useICPAi] Generated ICP bundle:", bundle);
        return bundle;
      } catch (err: any) {
        console.error("[useICPAi] AI generation failed:", err);
        setError(err?.message || "Failed to generate ICP with AI.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    generateAll,
    isLoading,
    error,
  };
}

export type { ICPSeedInput, ICPProfile, ICPInsights, ICPAvatarResult };

