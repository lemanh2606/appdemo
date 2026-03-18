import { useMutation } from "@tanstack/react-query";
import { askAI } from "../../../services/aiService";

export const useAI = () => {
  return useMutation({
    mutationFn: askAI,
  });
};