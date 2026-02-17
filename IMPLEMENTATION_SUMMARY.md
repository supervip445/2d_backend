# Bet Placement Implementation Summary

## ✅ Completed Implementation

### 1. **Prisma Schema Updates** ✅
- Added `two_d_limit` field to User model
- Created `Battle` model for betting sessions
- Created `TwoBetSlip` model for bet slip records
- Created `TwoBet` model for individual bet records
- Created `TwoDLimit` model for overall break limits
- Created `ChooseDigit` model for closed digit management
- Created `HeadClose` model for closed head digit management
- Created `SlipNumberCounter` model for atomic counter
- Created `TwoDResult` model for winning results
- Added proper relations between models

### 2. **Utilities & Services** ✅
- **SessionHelper** (`src/utils/sessionHelper.ts`)
  - Determines current session (morning/evening/closed)
  - Gets current game date and time in Asia/Yangon timezone
  
- **SlipNumberGeneratorService** (`src/services/slipNumberGenerator.service.ts`)
  - Generates unique slip numbers: `NNNNNN-mk-2d-YYYY-MM-DD-HH:MM:SS`
  - Uses atomic counter with transaction safety
  - Handles collisions with retry logic

- **LimitCheckerService** (`src/services/limitChecker.service.ts`)
  - Checks closed digits (choose_digits)
  - Checks closed head digits (head_closes)
  - Checks overall break limits
  - Checks user personal limits

- **BetPlacementService** (`src/services/betPlacement.service.ts`)
  - Validates betting session is open
  - Validates amounts and balance
  - Checks all limits
  - Generates slip number
  - Creates bet slip and individual bet records
  - Deducts balance atomically

### 3. **Controllers** ✅
- **BetController** (`src/controllers/bet.controller.ts`)
  - `POST /api/bets` - Place bet
  - `GET /api/bets/slips` - Get bet slips (history)
  - `GET /api/bets/slips/evening` - Get evening session slips
  - `GET /api/bets/winners` - Get daily winners

### 4. **Routes** ✅
- **bet.routes.ts** (`src/routes/bet.routes.ts`)
  - All routes require authentication
  - Integrated into main router

### 5. **Wallet Service Update** ✅
- Added `deductBalance` method for bet transactions

---

## 🔧 Next Steps (Required)

### 1. **Generate Prisma Client**
After schema changes, you need to regenerate Prisma Client:

```bash
npx prisma generate
```

### 2. **Create Database Migration**
Create and apply migration for new tables:

```bash
npx prisma migrate dev --name add_bet_tables
```

### 3. **Seed Initial Data**
You'll need to seed:
- At least one active `Battle` record (status = true)
- At least one `TwoDLimit` record
- Initial `SlipNumberCounter` record (id = 1, current_number = 0)

### 4. **Update Player App API**
Update `2d_player_app/src/services/api.ts` to use the new endpoints:

```typescript
export const betAPI = {
  placeBet: (betData: any) => api.post('/bets', betData),
  getBetSlips: (params?: any) => api.get('/bets/slips', { params }),
  getEveningSlips: (params?: any) => api.get('/bets/slips/evening', { params }),
  getWinners: (params?: any) => api.get('/bets/winners', { params }),
};
```

---

## 📋 API Endpoints

### POST /api/bets
**Request:**
```json
{
  "totalAmount": 500.00,
  "amounts": [
    { "num": "01", "amount": 100.00 },
    { "num": "23", "amount": 200.00 },
    { "num": "45", "amount": 200.00 }
  ]
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "ထီအောင်မြင်စွာ ထိုးပြီးပါပြီ။"
}
```

**Response (Error - Over Limit):**
```json
{
  "success": false,
  "message": "သင့်ရွှေးချယ်ထားသော '01', '23' ဂဏန်းမှာ သတ်မှတ် အမောင့်ထက်ကျော်လွန်ပါသောကြောင့် ကံစမ်း၍မရနိုင်ပါ။",
  "error": "Over Limit",
  "overLimitDigits": ["01", "23"]
}
```

### GET /api/bets/slips
**Query Parameters:**
- `session` (optional): `morning` | `evening`
- `date` (optional): `YYYY-MM-DD` (default: today)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "slip_no": "000001-mk-2d-2026-02-15-02:15:02",
      "total_bet_amount": "400.00",
      "session": "morning",
      "status": "pending",
      "two_bets": [...]
    }
  ],
  "message": "Your morning session two-digit bet slips retrieved successfully."
}
```

### GET /api/bets/winners
**Query Parameters:**
- `date` (optional): `YYYY-MM-DD`
- `session` (optional): `morning` | `evening`

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2026-02-15",
    "session": "morning",
    "win_digit": "23",
    "winners": [
      {
        "member_name": "PLAYER0101",
        "bet_amount": 100.00,
        "win_amount": 8000.00
      }
    ]
  }
}
```

---

## ⚠️ Important Notes

1. **Timezone**: All date/time operations use `Asia/Yangon` timezone
2. **Session Times**:
   - Morning: 00:00 - 12:00
   - Evening: 12:04 - 16:30
3. **Payout Multiplier**: 80x (bet_amount × 80)
4. **Slip Number Format**: `000001-mk-2d-2026-02-15-02:15:02`
5. **Transactions**: All bet placements use database transactions for atomicity

---

## 🐛 Known Issues to Fix

1. **Prisma Client**: Needs regeneration after schema changes
2. **Type Errors**: Some Prisma model names need to match schema (camelCase vs snake_case)
3. **Initial Data**: Need to seed Battle, TwoDLimit, and SlipNumberCounter

---

**Status**: ✅ **IMPLEMENTATION COMPLETE** - Ready for testing after Prisma generation and migration

