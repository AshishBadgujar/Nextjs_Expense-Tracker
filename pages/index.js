import React, { useEffect, useState } from "react";
import MainCard from "../components/mainCard";
import auth0 from '../utils/auth0';
import Axios from 'axios';
import Navbar from '../components/Navbar';
import { DateSort, MonthDaysSort, DaySort, CategorySort, MonthCategorySort } from '../utils/helpFunc';
import AnguChart from "../components/anguChart";
import baseUrl from '../utils/baseUrl'
import { Grid } from "@material-ui/core";

export default function Home({ user, dayData, monthData, weekData, forMonth }) {
  const [thisMonth, setThisMonth] = useState({ _id: 0, total: 0 })
  const [weekArray, setWeekArray] = useState([])
  const daysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const d = new Date();

  useEffect(() => {
    monthData.forEach(item => {
      if (item._id == d.getMonth()) {
        setThisMonth(item)
      }
    })

    let temp = weekData.map(item => {
      return { category: daysArray[item._id], amount: item.total }
    })
    setWeekArray(temp);
  }, [])

  return (
    <>
      <Navbar user={user} />
      <Grid
        container
        justify="space-around"
        alignItems="center"
        spacing={0}>
        <Grid item xs={12} sm={6}>
          <AnguChart total={dayData.reduce((a, b) => a + b.amount, 0)} catData={CategorySort(dayData)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MainCard heading='Today' total={dayData.reduce((a, b) => a + b.amount, 0)} catData={CategorySort(dayData)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MainCard heading='This Week' total={weekData.reduce((a, b) => a + b.total, 0)} catData={weekArray} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MainCard heading='This Month' total={thisMonth.total} catData={forMonth} />
        </Grid>
      </Grid>
    </>
  )
}

export async function getStaticProps(ctx) {
  const session = await auth0.getSession(ctx.req)
  var forMonth = [];
  var dayData = [];
  var monthData = [];
  var weekData = [];
  if (session) {
    try {
      let user = session.user;
      let res = await Axios.get(`${baseUrl}/api/${user.sub}`)
      let res2 = res.data
      dayData = DateSort(res2);
      forMonth = MonthCategorySort(res2);
      monthData = MonthDaysSort(res2);
    } catch (error) {
      console.log(error)
    }

    try {
      let user = session.user;
      let res = await Axios.get(`${baseUrl}/api/weeks/${user.sub}`)
      let res2 = res.data
      weekData = DaySort(res2)
    } catch (error) {
      console.log(error)
    }
  }
  return {
    props: {
      user: session?.user || null,
      dayData,
      monthData,
      weekData,
      forMonth
    }
  }
}