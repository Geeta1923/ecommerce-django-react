export const adminStatsReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADMIN_STATS_REQUEST':
      return { loading: true }

    case 'ADMIN_STATS_SUCCESS':
      return { loading: false, stats: action.payload }

    case 'ADMIN_STATS_FAIL':
      return { loading: false, error: action.payload }

    default:
      return state
  }
}
