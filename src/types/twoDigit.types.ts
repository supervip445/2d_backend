export interface TwoDigit {
  id: number;
  two_digit: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTwoDigitDto {
  two_digit: string;
  status?: number;
}

export interface UpdateTwoDigitDto {
  status?: number;
}

export interface TwoDigitFilters {
  status?: number;
  search?: string;
} 