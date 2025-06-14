import { APIResponse } from "@/types/auth";
import api from "../../axios";
import { CreatePot, Pot, PotSummary, UpdatePot } from "./types";

const getPots = async (): Promise<APIResponse<Pot[]>> => {
  const response = await api.get('/pots');
  return response.data;
}

const getPotById = async (id: number): Promise<APIResponse<Pot>> => {
  const response = await api.get(`/pots/${id}`);
  return response.data;
}

const getPotSummary = async (): Promise<APIResponse<PotSummary>> => {
  const response = await api.get('/pots/summary');
  return response.data;
}

const createPot = async (pot: CreatePot): Promise<APIResponse<Pot>> => {
  const response = await api.post('/pots', pot);
  return response.data;
}

const updatePot = async (id: number, pot: UpdatePot): Promise<APIResponse<Pot>> => {
  const response = await api.put(`/pots/${id}`, pot);
  return response.data;
}

const updateSavedAmount = async (id: number, amount: number): Promise<APIResponse<Pot>> => {
  const response = await api.patch(`/pots/${id}/update-saved-amount`, { amount });
  return response.data;
}

const deletePot = async (id: number): Promise<APIResponse<boolean>> => {
  const response = await api.delete(`/pots/${id}`);
  return response.data;
}

export const potsService = {
  getPots,
  getPotById,
  getPotSummary,
  createPot,
  updatePot,
  updateSavedAmount,
  deletePot,
}