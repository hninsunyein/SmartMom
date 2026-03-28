// All requests go through Next.js proxy defined in next.config.js:
//   /api/* → http://localhost:5000/api/*
// This avoids CORS issues in both dev and Docker.
const API_BASE_URL = '/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // ─── Token helpers ───────────────────────────────────────────────────────────

  getToken() {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('token');
  }

  setToken(token) {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('token', token);
  }

  removeToken() {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('token');
  }

  getRefreshToken() {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('refreshToken');
  }

  setRefreshToken(token) {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('refreshToken', token);
  }

  removeRefreshToken() {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('refreshToken');
  }

  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // ─── Internal refresh helpers ─────────────────────────────────────────────

  async _tryRefresh() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;
    try {
      const res = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.token) this.setToken(data.token);
      if (data.refreshToken) this.setRefreshToken(data.refreshToken);
      return true;
    } catch {
      return false;
    }
  }

  _forceLogout() {
    this.removeToken();
    this.removeRefreshToken();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
  }

  // ─── Core request ─────────────────────────────────────────────────────────────

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      let response = await fetch(url, config);

      // Auto-refresh on 401 (skip for auth endpoints to avoid loops)
      if (response.status === 401 && !endpoint.startsWith('/auth/')) {
        const refreshed = await this._tryRefresh();
        if (refreshed) {
          config.headers = this.getAuthHeaders();
          response = await fetch(url, config);
        } else {
          this._forceLogout();
          throw new Error('Session expired. Please log in again.');
        }
      }

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        if (!response.ok) {
          throw new Error(
            `Server error (${response.status}): ` +
            (text.length < 120 ? text : 'Check that the backend is running on port 5000')
          );
        }
        throw new Error('Unexpected non-JSON response from server');
      }

      if (!response.ok) {
        const msg = Array.isArray(data.message)
          ? data.message.join(', ')
          : (data.message || `Request failed with status ${response.status}`);
        throw new Error(msg);
      }

      return data;
    } catch (error) {
      console.error(`API [${endpoint}] failed:`, error.message);
      throw error;
    }
  }

  get(endpoint)              { return this.request(endpoint, { method: 'GET' }); }
  post(endpoint, body)       { return this.request(endpoint, { method: 'POST',   body: JSON.stringify(body) }); }
  put(endpoint, body = {})   { return this.request(endpoint, { method: 'PUT',    body: JSON.stringify(body) }); }
  delete(endpoint)           { return this.request(endpoint, { method: 'DELETE' }); }

  // ─── Auth ─────────────────────────────────────────────────────────────────────
  // Response: { success, token, user }  (register/login)
  // Response: { success, user }          (getProfile)

  registerParent(data)             { return this.post('/auth/register/parent', data); }
  registerAdvisor(data)            { return this.post('/auth/register/advisor', data); }
  login(credentials)               { return this.post('/auth/login', credentials); }
  getProfile()                     { return this.get('/auth/me'); }
  forgotPassword(email)            { return this.post('/auth/forgot-password', { email }); }
  resetPassword(token, password)   { return this.post('/auth/reset-password', { token, password }); }
  refreshToken()                   { return this.post('/auth/refresh', { refreshToken: this.getRefreshToken() }); }
  logoutApi()                      { return this.post('/auth/logout', {}); }
  upgradePlan()                    { return this.put('/auth/upgrade'); }

  // ─── Children ─────────────────────────────────────────────────────────────────
  // Response: { success, data: Child[] | Child }

  getChildren()             { return this.get('/children'); }
  getChild(id)              { return this.get(`/children/${id}`); }
  createChild(data)         { return this.post('/children', data); }
  updateChild(id, data)     { return this.put(`/children/${id}`, data); }
  deleteChild(id)           { return this.delete(`/children/${id}`); }

  // ─── Growth Tracking ──────────────────────────────────────────────────────────
  // Response: { success, data: GrowthRecord[] | GrowthRecord }

  getGrowthHistory(childId)      { return this.get(`/growth/child/${childId}`); }
  addGrowthMeasurement(data)     { return this.post('/growth', data); }

  // ─── Nutrition ────────────────────────────────────────────────────────────────
  // generateMealPlan response: { success, data: { ageGroup, ageGroupLabel, goals, breakfast[], lunch[], dinner[] } }
  // calculateCalories response: { success, data: { foodItem, amount, caloriesPer100, totalCalories } }

  getNutritionPlans(childId)             { return this.get(`/nutrition/plans/child/${childId}`); }
  createNutritionPlan(data)              { return this.post('/nutrition/plans', data); }
  generateMealPlan(ageGroup, goals)      { return this.post('/nutrition/generate', { ageGroup, goals }); }
  calculateCalories(foodItem, amount)    { return this.post('/nutrition/calculate', { foodItem, amount }); }

  // Meal selection — Free & Premium
  saveMealSelection(data)                { return this.post('/nutrition/meal-selections', data); }
  getActiveMealPlan(childId)             { return this.get(`/nutrition/meal-selections/child/${childId}/active`); }
  checkFreePlanExists(childId)           { return this.get(`/nutrition/meal-selections/child/${childId}/check`); }
  getMealPlanHistory(childId)            { return this.get(`/nutrition/meal-selections/child/${childId}/history`); }
  getShoppingList(selectionId)           { return this.get(`/nutrition/meal-selections/${selectionId}/shopping-list`); }
  // Monthly restriction
  checkMonthlyPlan(childId)              { return this.get(`/nutrition/child/${childId}/monthly-check`); }
  deleteCurrentMonthPlan(childId)        { return this.delete(`/nutrition/child/${childId}/current-month-plan`); }
  // Month plan view
  getMonthPlan(childId, year, month)     { return this.get(`/nutrition/child/${childId}/month-plan?year=${year}&month=${month}`); }

  // ─── Appointments ─────────────────────────────────────────────────────────────
  // Response: { success, data: Appointment[] | Appointment }

  getAppointments()                  { return this.get('/appointments'); }
  createAppointment(data)            { return this.post('/appointments', data); }
  approveAppointment(id)             { return this.put(`/appointments/${id}/approve`); }
  rejectAppointment(id)              { return this.put(`/appointments/${id}/reject`); }
  cancelAppointment(id)              { return this.put(`/appointments/${id}/cancel`); }
  updateAppointmentNotes(id, notes)  { return this.request(`/appointments/${id}/notes`, { method: 'PATCH', body: JSON.stringify({ notes }) }); }

  // ─── Advisors ─────────────────────────────────────────────────────────────────
  // Response: { success, data: Advisor[] | Advisor }

  getAdvisors()           { return this.get('/advisors'); }
  getAllAdvisors()         { return this.get('/advisors/all'); }
  getPendingAdvisors()    { return this.get('/advisors/pending'); }
  getAdvisor(id)          { return this.get(`/advisors/${id}`); }
  approveAdvisor(id)      { return this.put(`/advisors/${id}/approve`); }
  rejectAdvisor(id)       { return this.put(`/advisors/${id}/reject`); }
  deleteAdvisor(id)       { return this.delete(`/advisors/${id}`); }

  // ─── Tips ─────────────────────────────────────────────────────────────────────
  // Response: { success, data: Tip[] | Tip }
  // Query params: type ('safety' | 'health'), ageGroup ('All Ages' | '0-2 years' | ...)

  getTips(type, ageGroup) {
    const params = new URLSearchParams();
    if (type)     params.set('type', type);
    if (ageGroup) params.set('ageGroup', ageGroup);
    const query = params.toString() ? `?${params}` : '';
    return this.get(`/tips${query}`);
  }

  createTip(data)        { return this.post('/tips', data); }
  updateTip(id, data)    { return this.put(`/tips/${id}`, data); }
  deleteTip(id)          { return this.delete(`/tips/${id}`); }

  // ─── Health check ─────────────────────────────────────────────────────────────

  healthCheck() { return this.get('/health'); }
}

export default new ApiService();
