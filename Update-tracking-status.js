//required to connect to db.
const { pool } = require("./dbConfig");
const fetch = require("node-fetch")

//Fetches data from postgress
async function updateFromBring() {
  const getFromDb = () => {
    return new Promise((resolve, reject) => {
      const getSQLdata = 'SELECT tracking, status FROM status WHERE status = false;'
      pool.query(getSQLdata, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        console.log(data.rows)
        resolve(data.rows)
      })
    })
  }

  const updateStatus = (trackingId, status) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE status SET status = ${status ? 'true' : 'false'} WHERE status.tracking = '${trackingId}';`
      //Updates tracking status
      pool.query(sql, function (err, data) {
        if (err) reject()
        if (data.rowCount >= 1) {
          resolve()
        } else {
          reject()
        }
      })
    })
  }

  try {
    const dbRows = await getFromDb()

    for (let row of dbRows) {
      const newStatus = await getTrackingStatus(row.tracking)
      if (!newStatus) continue
      console.log(`Update  ${row.tracking} to ${newStatus}`)
      await updateStatus(row.tracking, newStatus)
    }
  } catch (err) {
    console.error('Could not update status for' + row.tracking , err)
  }
}


//Using Bring API to check if tracking number status == DELIVERED
async function getTrackingStatus(trackingId) {
  //sporing for bruk til test 00370730250676146573 (Denne skal gi respons som 'DELIVERED')
  const bringAPI = `https://tracking.bring.com/api/v2/tracking.json?q=${trackingId}`
  const respons = await fetch(bringAPI)
  const responseJson = await respons.json()
  console.log(trackingId)

  if (responseJson.consignmentSet.length < 1) {
    return null
  }
  const events = responseJson.consignmentSet[0].packageSet[0].eventSet[0].status

  return events === 'DELIVERED'
}

  try {
  updateFromBring()
  console.log('status is updated')
} catch (e) { }  
