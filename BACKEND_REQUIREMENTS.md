# Backend API Requirements for 2D/3D Player App

Based on the PHP Laravel backend in the `db` directory, here are the required backend endpoints and functionality needed for the React Native player app.

## 📋 Required API Endpoints

### 1. **Place Bet** - `POST /api/bets`
**Purpose:** Place a 2D bet with multiple numbers

**Request Body:**
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

**Validation:**
- ✅ User must be authenticated (Player role)
- ✅ Check if betting is open (active Bettle/battle session)
- ✅ Validate `totalAmount` matches sum of `amounts[].amount`
- ✅ Check user balance is sufficient
- ✅ Check limits:
  - Overall break limit (from `two_d_limits` table)
  - User personal limit (from `users.two_d_limit`)
  - Closed digits (from `choose_digits` where status = false)
  - Closed head digits (from `head_closes` where status = false)
  - Projected total bet amount per digit (shouldn't exceed overall break)
  - Projected user bet amount per digit (shouldn't exceed user limit)

**Process:**
1. Determine current session (morning/evening) using `SessionHelper`
2. Generate unique slip number: `NNNNNN-mk-2d-YYYY-MM-DD-HH:MM:SS`
   - Use atomic counter from `slip_number_counter` table
   - Format: `000001-mk-2d-2026-02-15-02:15:02`
3. Deduct balance from user's wallet
4. Create `two_bet_slips` record:
   - `slip_no`, `user_id`, `player_name`, `agent_id`
   - `total_bet_amount`, `session`, `status: 'pending'`
   - `game_date`, `game_time`, `before_balance`, `after_balance`
5. Create multiple `two_bets` records (one per number):
   - Link to `two_bet_slips` via `slip_id`
   - Store `bet_number`, `bet_amount`, `session`, `game_date`, `game_time`
   - Link to `choose_digit_id`, `head_close_id`, `bettle_id`

**Response:**
```json
// Success
{
  "success": true,
  "message": "ထီအောင်မြင်စွာ ထိုးပြီးပါပြီ။"
}

// Error - Insufficient funds
{
  "success": false,
  "message": "လက်ကျန်ငွေ မလုံလောက်ပါ။",
  "error": "Insufficient Funds"
}

// Error - Over limit digits
{
  "success": false,
  "message": "သင့်ရွှေးချယ်ထားသော '01', '23' ဂဏန်းမှာ သတ်မှတ် အမောင့်ထက်ကျော်လွန်ပါသောကြောင့် ကံစမ်း၍မရနိုင်ပါ။",
  "error": "Over Limit",
  "overLimitDigits": ["01", "23"]
}

// Error - Betting closed
{
  "success": false,
  "message": "This 2D lottery Bettle is closed at this time. Welcome back next time!",
  "error": "Betting Closed"
}
```

---

### 2. **Get Bet Slips (History)** - `GET /api/bets/slips`
**Purpose:** Get user's betting slips for current session

**Query Parameters:**
- `session` (optional): `'morning'` | `'evening'`
- `date` (optional): `'YYYY-MM-DD'` (default: today)

**Session Logic:**
- **Morning session:** 00:00 - 12:00 (display until 1:00 PM)
- **Evening session:** 12:04 - 16:30 (display until 6:00 PM)
- Auto-determine session based on current time

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "slip_no": "000001-mk-2d-2026-02-15-02:15:02",
      "user_id": 5,
      "player_name": "PLAYER0101",
      "agent_id": 2,
      "total_bet_amount": "400.00",
      "session": "morning",
      "status": "pending",
      "game_date": "2026-02-15",
      "game_time": "12:00:00",
      "before_balance": "1000.00",
      "after_balance": "600.00",
      "created_at": "2026-02-15T02:15:02.000000Z",
      "two_bets": [
        {
          "id": 1,
          "bet_number": "23",
          "bet_amount": "100.00",
          "session": "morning",
          "win_lose": false,
          "bet_status": false,
          "game_date": "2026-02-15",
          "game_time": "12:00:00"
        },
        {
          "id": 2,
          "bet_number": "28",
          "bet_amount": "100.00",
          "session": "morning",
          "win_lose": false,
          "bet_status": false,
          "game_date": "2026-02-15",
          "game_time": "12:00:00"
        },
        {
          "id": 3,
          "bet_number": "34",
          "bet_amount": "100.00",
          "session": "morning",
          "win_lose": false,
          "bet_status": false,
          "game_date": "2026-02-15",
          "game_time": "12:00:00"
        },
        {
          "id": 4,
          "bet_number": "25",
          "bet_amount": "100.00",
          "session": "morning",
          "win_lose": false,
          "bet_status": false,
          "game_date": "2026-02-15",
          "game_time": "12:00:00"
        }
      ]
    }
  ],
  "message": "Your morning session two-digit bet slips retrieved successfully."
}
```

---

### 3. **Get Evening Session Slips** - `GET /api/bets/slips/evening`
**Purpose:** Get user's evening session betting slips

**Response:** Same format as above, filtered for evening session

---

### 4. **Get Daily Winners** - `GET /api/bets/winners`
**Purpose:** Get winner list for a specific date/session

**Query Parameters:**
- `date` (optional): `'YYYY-MM-DD'` (default: today)
- `session` (optional): `'morning'` | `'evening'`

**Response:**
```json
// Single session
{
  "success": true,
  "data": {
    "date": "2026-02-15",
    "session": "morning",
    "win_digit": "23",
    "winners": [
      {
        "member_name": "PLAYER0101",
        "bet_amount": "100.00",
        "win_amount": "8000.00"
      },
      {
        "member_name": "PLAYER0202",
        "bet_amount": "200.00",
        "win_amount": "16000.00"
      }
    ]
  },
  "message": "2D winner list retrieved"
}

// Latest results (multiple sessions)
{
  "success": true,
  "data": {
    "latest_results": [
      {
        "date": "2026-02-15",
        "session": "morning",
        "win_digit": "23",
        "winners": [...]
      },
      {
        "date": "2026-02-15",
        "session": "evening",
        "win_digit": "45",
        "winners": [...]
      }
    ]
  },
  "message": "Latest 2D winners (with winners list)"
}
```

---

## 🗄️ Database Schema Requirements

### Table: `two_bet_slips`
```sql
- id (bigint, primary key)
- slip_no (string, unique) - Format: "000001-mk-2d-YYYY-MM-DD-HH:MM:SS"
- user_id (bigint, foreign key -> users)
- player_name (string)
- agent_id (bigint, foreign key -> users, nullable)
- total_bet_amount (decimal 12,2)
- session (enum: 'morning', 'evening')
- status (enum: 'pending', 'completed', 'cancelled')
- game_date (date)
- game_time (time)
- before_balance (decimal 12,2)
- after_balance (decimal 12,2)
- created_at, updated_at
```

### Table: `two_bets`
```sql
- id (bigint, primary key)
- user_id (bigint, foreign key -> users)
- member_name (string, nullable)
- bettle_id (bigint, foreign key -> battles, nullable)
- choose_digit_id (bigint, foreign key -> choose_digits, nullable)
- head_close_id (bigint, foreign key -> head_closes, nullable)
- agent_id (bigint, foreign key -> users, nullable)
- bet_number (string) - 2-digit number: "00" to "99"
- bet_amount (decimal 10,2)
- session (enum: 'morning', 'evening')
- win_lose (boolean, default: false)
- potential_payout (decimal 10,2, default: 0)
- bet_status (boolean, default: false) - false: pending, true: settled
- bet_result (string, nullable)
- game_date (date)
- game_time (time)
- slip_id (bigint, foreign key -> two_bet_slips)
- created_at, updated_at
```

### Table: `battles` (Bettle)
```sql
- id (bigint, primary key)
- battle_name (string)
- start_time (datetime)
- end_time (datetime)
- status (boolean) - true: active/open, false: closed
- open_date (date)
- created_at, updated_at
```

### Table: `two_d_limits`
```sql
- id (bigint, primary key)
- two_d_limit (decimal) - Overall break amount
- created_at, updated_at
```

### Table: `choose_digits`
```sql
- id (bigint, primary key)
- choose_close_digit (string) - 2-digit number
- status (boolean) - false: closed, true: open
- created_at, updated_at
```

### Table: `head_closes`
```sql
- id (bigint, primary key)
- head_close_digit (string) - Single digit (0-9)
- status (boolean) - false: closed, true: open
- created_at, updated_at
```

### Table: `slip_number_counter`
```sql
- id (bigint, primary key, default: 1)
- current_number (bigint, default: 0)
- updated_at
```

### Table: `two_d_results`
```sql
- id (bigint, primary key)
- result_date (date)
- session (enum: 'morning', 'evening')
- win_number (string) - Winning 2-digit number
- created_at, updated_at
```

### Users Table (Additional Field)
```sql
- two_d_limit (decimal, nullable) - User's personal betting limit per digit
```

---

## 🔧 Business Logic Requirements

### Session Management
```typescript
// SessionHelper equivalent
function getCurrentSession(): 'morning' | 'evening' | 'closed' {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeInMinutes = hour * 60 + minute;
  
  // Morning: 00:00 - 12:00
  if (timeInMinutes >= 0 && timeInMinutes <= 12 * 60) {
    return 'morning';
  }
  // Evening: 12:04 - 16:30
  else if (timeInMinutes >= (12 * 60 + 4) && timeInMinutes <= (16 * 60 + 30)) {
    return 'evening';
  }
  return 'closed';
}
```

### Slip Number Generation
```typescript
// Format: NNNNNN-mk-2d-YYYY-MM-DD-HH:MM:SS
// Example: 000001-mk-2d-2026-02-15-02:15:02
async function generateUniqueSlipNumber(): Promise<string> {
  // 1. Atomically increment counter in slip_number_counter table
  // 2. Format counter as 6-digit with leading zeros
  // 3. Combine with current date/time
  // 4. Check uniqueness, retry if collision (max 20 retries)
  // 5. Return unique slip number
}
```

### Limit Checking
```typescript
async function checkAllLimits(
  amounts: Array<{num: string, amount: number}>,
  session: string,
  gameDate: string,
  overallBreakAmount: number,
  userPersonalLimit?: number
): Promise<string[]> {
  // Returns array of over-limit digit strings (e.g., ["01", "23"])
  
  // 1. Get closed digits from choose_digits (status = false)
  // 2. Get closed head digits from head_closes (status = false)
  // 3. For each bet amount:
  //    - Check if digit is closed
  //    - Check if head digit is closed
  //    - Check projected total bet amount for digit (all users)
  //    - Check projected user bet amount for digit
  // 4. Return array of over-limit digits
}
```

### Wallet Integration
- Use existing `WalletService` to deduct balance
- Transaction type: `TwoDigitBet`
- Store metadata: slip_no, session, game_date, game_time, bet_details

---

## 📝 Implementation Checklist

### Phase 1: Database Setup
- [ ] Create Prisma schema for all required tables
- [ ] Run migrations
- [ ] Seed initial data (battles, limits, etc.)

### Phase 2: Core Services
- [ ] Implement `SessionHelper` equivalent
- [ ] Implement `SlipNumberGenerator` service
- [ ] Implement `LimitChecker` service
- [ ] Extend `WalletService` for bet transactions

### Phase 3: Controllers
- [ ] `POST /api/bets` - Place bet
- [ ] `GET /api/bets/slips` - Get bet slips
- [ ] `GET /api/bets/slips/evening` - Get evening slips
- [ ] `GET /api/bets/winners` - Get winners

### Phase 4: Validation & Error Handling
- [ ] Request validation middleware
- [ ] Limit checking logic
- [ ] Error responses with proper messages
- [ ] Transaction rollback on errors

### Phase 5: Testing
- [ ] Unit tests for services
- [ ] Integration tests for endpoints
- [ ] Test limit checking scenarios
- [ ] Test concurrent bet placement

---

## 🔗 Integration Points

### Existing Backend Integration
- ✅ User authentication (already exists)
- ✅ Wallet service (already exists)
- ✅ Two-digit status checking (already exists)
- ⚠️ Need to add: Bet placement, history, winners

### Frontend Integration
- Update `src/services/api.ts` in player app
- Add bet placement endpoint
- Add history endpoint
- Add winners endpoint

---

## 📌 Notes

1. **Timezone:** Use `Asia/Yangon` timezone for all date/time operations
2. **Currency:** All amounts in decimal format (12,2 or 10,2)
3. **Payout:** Winning amount = bet_amount × 80 (80x multiplier)
4. **Status Flow:** pending → completed (when result is announced)
5. **Concurrency:** Use database transactions and locks for slip number generation

---

**Status:** 📋 **REQUIREMENTS DOCUMENTED** - Ready for implementation

