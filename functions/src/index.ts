/* eslint-disable no-unused-vars */
import {onRequest} from "firebase-functions/v2/https"
import * as logger from "firebase-functions/logger"
import express from "express"
import * as functions from "firebase-functions"
import Timetable from 'comcigan-parser'
import { timetableData } from 'comcigan-parser'
/* eslint-disable no-unused-vars */
const t = new Timetable()
const schoolName = "도당고등학교"
const _grade = 3
const _class = 6
let myClassTimeTable: Array<Array<{'subject': string}>>
const app = express()
app.get("/test/", async (_req, res) => {
    await (async () => {
        await t.init({maxGrade: 3, cache: 0})
        const schoolList = await t.search('도당')
        const mySchool = schoolList.find(school => school.name == schoolName)!
        t.setSchool(mySchool.code)
        const table: timetableData = await t.getTimetable()
        myClassTimeTable = table[_grade][_class]
    })()
    const data = {myClassTimeTable}
    const todayData = data.myClassTimeTable[new Date().getDay()]
    let classTime = 1
    let result = ``
    todayData.map((val) => {
        result += `${classTime}교시 ${val['subject']}\n`
        classTime += 1
    })
    res.json({data: result})
})

const api = functions.https.onRequest(app)

module.exports = {
    api
}

export const helloWorld = onRequest((_request, response) => {
    logger.info("Hello logs!", {structuredData: true})
    response.send("Hello from Firebase!")
})
