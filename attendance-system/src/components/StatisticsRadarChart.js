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

    this.createRadarChartData = this.createRadarChartData.bind(this);
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
            data={this.createRadarChartData(this.state.data)}
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

  createRadarChartData() {
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

    console.log(dataArray);

    return dataArray;
  }
}
