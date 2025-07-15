const sortUpcomingEvents = (events) => {
  return events.sort((a, b) => {
    const dateA = new Date(a.datetime)
    const dateB = new Date(b.datetime)

    if (dateA.getTime() !== dateB.getTime()) {
      return dateA - dateB
    }
    return a.location.localeCompare(b.location)
  })
}
const getEventStats = async (eventId, pool) => {
  const totalResult = await pool.query(
    'SELECT COUNT(*) FROM registrations WHERE event_id = $1',
    [eventId]
  )

  const eventResult = await pool.query(
    'SELECT capacity FROM events WHERE id = $1',
    [eventId]
  )

  const totalRegistrations = parseInt(totalResult.rows[0].count, 10)
  const capacity = eventResult.rows[0].capacity
  const remaining = capacity - totalRegistrations
  const percentageUsed = ((totalRegistrations / capacity) * 100).toFixed(2)

  return {
    totalRegistrations,
    remainingCapacity: remaining,
    percentageUsed: `${percentageUsed}%`,
  }
}
module.exports = {
  sortUpcomingEvents,
  getEventStats,
}
