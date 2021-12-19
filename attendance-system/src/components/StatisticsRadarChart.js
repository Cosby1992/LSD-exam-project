import React, { Component } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import "../styles/StatisticsRadarChart.css";

export default class StatisticsRadarChart extends Component {
  constructor(props) {
    super(props);

    let start = new Date();
    let end = new Date();
    start.setMonth(end.getMonth() - 1);

    this.state = {
      data: null,
      fetchError: false,
      startDate: start.toISOString().substring(0, 10),
      endDate: end.toISOString().substring(0, 10),
    };

    this.createRadarChartDataTeacher = this.createRadarChartDataTeacher.bind(this);
  }

  async componentDidMount() {
    let start = new Date();
    let end = new Date();
    start.setMonth(end.getMonth() - 1);

    const url =
      "http://localhost:3200/statistics/overall/" +
      start.toISOString() +
      "/" +
      end.toISOString() +
      "";

    await fetch(url, {
      method: "GET",
      headers: new Headers({
        Authorization: this.props.authToken,
      }),
    }).then(async (response) => {
      if (response.status === 200) {
        const json = await response.json();

        this.setState({
          data: json.statistics,
        });
      } else {
        this.setState({
          fetchError: true,
        });
      }
    });
  }

  render() {

    if (!Array.isArray(this.state.data?.lectures)) {
      return <div className="radar-chart-wrapper">Loading</div>;
    } else {
      return (
        <div className="radar-chart-wrapper">
          <RadarChart
            cx={400}
            cy={200}
            outerRadius={150}
            width={800}
            height={400}
            data={this.state.data?.lectures[0]?.attendacePercentage ? this.createRadarChartDataTeacher(this.state.data) : this.createRadarChartDataStudent(this.state.data)}
            fill="#FFFFFF"
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar
              name="Attendance"
              dataKey="A"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </RadarChart>

          {this.state.data?.overallAttendancePercentage ?
            <h2 style={{textAlign: 'center'}}>Overall <span style={{color: 'yellow'}}>{this.state.data.overallAttendancePercentage.toFixed(2)}%</span> student attendance in the period</h2>
            :
            null
          }

          {this.state.data?.attendancePercentage ?
            <h2 style={{textAlign: 'center'}}>Overall <span style={{color: 'yellow'}}>{this.state.data.attendancePercentage.toFixed(2)}%</span> attendance in the period</h2>
            :
            null
          }

          <div className="date-picker-radar-wrapper">
            <div>
              <label>From </label>
              <input type="date" value={this.state.startDate} onChange={(e) => {this.setState({startDate: e.target.value}); this.fetchNewData(e.target.value, this.state.endDate)}}></input>
            </div>

            <div>
              <label>To </label>
              <input type="date" value={this.state.endDate} onChange={(e) => {this.setState({endDate: e.target.value}); this.fetchNewData(this.state.startDate, e.target.value)}}></input>
            </div>
          </div>
        </div>
      );
    }
  }

  async fetchNewData(dateStart, dateEnd) {
    const url =
      "http://localhost:3200/statistics/overall/" +
      dateStart +
      "/" +
      dateEnd +
      "";

    await fetch(url, {
      method: "GET",
      headers: new Headers({
        Authorization: this.props.authToken,
      }),
    }).then(async (response) => {
      if (response.status === 200) {
        const json = await response.json();

        this.setState({
          data: json.statistics,
        });
      } else {
        this.setState({
          fetchError: true,
        });
      }
    });
  }

  createRadarChartDataStudent() {

    var dataArray = [];

    var dataMap = new Map();
    var amountMap = new Map();

    for (let i = 0; i < this.state.data.lectures.length; i++) {
      const lecture = this.state.data.lectures[i];

      if (!dataMap.has(lecture.lecture_name)) {
        if(lecture.attended) dataMap.set(lecture.lecture_name, 1);
        dataMap.set(lecture.lecture_name, 0);
        amountMap.set(lecture.lecture_name, 1);
      } else {
        if(lecture.attended) {
          dataMap.set(
            lecture.lecture_name,
            dataMap.get(lecture.lecture_name) + 1
          );
        }
        
        amountMap.set(
          lecture.lecture_name,
          amountMap.get(lecture.lecture_name) + 1
        );
      }
    }

    dataMap.forEach((value, key) => {
      dataArray.push({
        subject: key,
        A: value / amountMap.get(key) * 100,
      });
    });

    return dataArray;

  }

  createRadarChartDataTeacher() {

    var dataArray = [];

    var dataMap = new Map();
    var amountMap = new Map();

    for (let i = 0; i < this.state.data.lectures.length; i++) {
      const lecture = this.state.data.lectures[i];

      if (!dataMap.has(lecture.lecture_name)) {
        dataMap.set(lecture.lecture_name, lecture.attendacePercentage);
        amountMap.set(lecture.lecture_name, 1);
      } else {
        dataMap.set(
          lecture.lecture_name,
          dataMap.get(lecture.lecture_name) + lecture.attendacePercentage
        );
        amountMap.set(
          lecture.lecture_name,
          amountMap.get(lecture.lecture_name) + 1
        );
      }
    }

    dataMap.forEach((value, key) => {
      dataArray.push({
        subject: key,
        A: value / amountMap.get(key),
      });
    });

    return dataArray;
  }


}
