import React, { Component } from "react";
import "../styles/TeacherView.css";

import MenuButton from "../components/MenuButton";
import SelectLectureDropDown from "../components/SelectLectureDropDown";
import StatisticsRadarChart from "../components/StatisticsRadarChart";

export default class TeacherView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startLecturePressed: false,
      startLectureStatus: 0,
      lectures: [],
      selectedLecture: "",
      generatedCode: "",
      timeRemaining: 0,
      intervalId: null,
      codeTTL: 300,
      statisticsPressed: false,
      statisticsData: [
        {
          subject: "Math",
          A: 350,
        },
        {
          subject: "Chinese",
          A: 98,
        },
        {
          subject: "English",
          A: 86,
        },
        {
          subject: "Geography",
          A: 99,
        },
        {
          subject: "Physics",
          A: 85,
        },
        {
          subject: "History",
          A: 65,
        },
      ],
    };

    this.selectStart = this.selectStart.bind(this);
    this.backToHome = this.backToHome.bind(this);
    this.startLecture = this.startLecture.bind(this);
    this.setSelectedLecture = this.setSelectedLecture.bind(this);
    this.showRemainingTime = this.showRemainingTime.bind(this);
    this.selectStatistics = this.selectStatistics.bind(this);
  }

  async componentDidMount() {
    const start = new Date();
    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(0);
    start.setMilliseconds(0);

    const end = new Date();
    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);

    const url = `http://localhost:3200/statistics/overall/${
      start.toISOString().split(".")[0]
    }/${end.toISOString().split(".")[0]}`;

    await fetch(url, {
      method: "GET",
      headers: new Headers({
        Authorization: this.props.authToken,
      }),
    }).then(async (response) => {
      if (response.status !== 200) return;

      const json = await response.json();

      this.setState({
        lectures: json.statistics.lectures,
        selectedLecture: json.statistics.lectures[0].lecture_id,
      });
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
    this.setState({
      intervalId: null,
    });
  }

  render() {
    if (this.state.startLecturePressed) {
      const message = this.generateMessage(this.state.startLectureStatus);

      return (
        <div className="teacher-outer-wrapper">
          <h1>Start Lecture</h1>

          {this.state.generatedCode !== "" ? null : (
            <SelectLectureDropDown
              data={this.state.lectures}
              setSelected={this.setSelectedLecture}
              selected={this.state.selectedLecture}
            ></SelectLectureDropDown>
          )}

          {message === "" ? null : (
            <div className="error-message-text">{message}</div>
          )}
          {this.state.startLectureStatus === 200 && this.state.generatedCode ? (
            <div className="attendance-code-wrapper">
              <h4>Attendance Code</h4>
              <h1>{this.state.generatedCode}</h1>
              <div>
                Time remaing:{" "}
                {this.calculateTTLString(this.state.timeRemaining)}
              </div>
            </div>
          ) : null}

          {this.state.generatedCode !== "" ? null : (
            <div className="attendance-code-wrapper">
              <div>Code expiration time</div>
              <input
                style={{ width: 300 }}
                type="range"
                step={10}
                min={10}
                max={600}
                value={this.state.codeTTL}
                onChange={(event) => {
                  this.updateTTLValue(event.target.value);
                }}
              ></input>
              <div>{this.calculateTTLString(this.state.codeTTL)}</div>
            </div>
          )}

          {this.state.generatedCode === "" ? (
            <MenuButton
              title="start lecture"
              function={(id) => {
                this.startLecture(id);
                this.showRemainingTime();
              }}
            ></MenuButton>
          ) : (
            <MenuButton
              title="cancel lecture"
              function={() => {
                this.cancelLecture();
              }}
            ></MenuButton>
          )}

          <MenuButton title="BACK" function={this.backToHome}></MenuButton>
        </div>
      );
    } 
    
    if (this.state.statisticsPressed) {
        return <div className="teacher-outer-wrapper">

            <StatisticsRadarChart data={this.state.statisticsData} authToken={this.props.authToken}></StatisticsRadarChart>

          <MenuButton title="BACK" function={this.backToHome}></MenuButton>
        </div>
    }


      return (
        <div className="teacher-outer-wrapper">
          <h1>WELCOME TEACHER</h1>
          <MenuButton title="Start lecture" function={this.selectStart}></MenuButton>
          <MenuButton title="See Statistics" function={this.selectStatistics}></MenuButton>
          <MenuButton title="LOGOUT" function={this.props.logout}></MenuButton>
        </div>
      );
  }

  updateTTLValue(value) {
    this.setState({
      codeTTL: value,
    });
  }

  selectStatistics() {
    this.setState({
      statisticsPressed: true,
    });
  }

  selectStart() {
    this.setState({
      startLecturePressed: true,
    });
  }

  backToHome() {
    this.setState({
      startLecturePressed: false,
      statisticsPressed: false,
    });
  }

  setSelectedLecture(string) {
    this.setState({
      selectedLecture: string,
      startLectureStatus: 0,
    });
  }

  calculateTTLString(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    return minutes > 0
      ? String(minutes) + " min. " + String(seconds) + " sec."
      : String(seconds) + " sec.";
  }

  cancelLecture() {
    if (this.state.intervalId !== null) {
      clearInterval(this.state.intervalId);
    }
    this.setState({
      intervalId: null,
      startLectureStatus: 0,
      generatedCode: "",
      timeRemaining: 0,
    });
  }

  showRemainingTime() {
    if (this.state.intervalId !== null) {
      clearInterval(this.state.intervalId);
      this.setState({
        intervalId: null,
      });
    }

    const id = setInterval(() => {
      if (this.state.timeRemaining < 1) {
        clearInterval(this.state.intervalId);
        this.setState({
          intervalId: null,
          startLectureStatus: 0,
          generatedCode: "",
          timeRemaining: 0,
        });
      }

      this.setState({
        timeRemaining: this.state.timeRemaining - 1,
      });
    }, 1000);

    this.setState({
      intervalId: id,
    });
  }

  async startLecture() {
    const url = "http://localhost:3200/lecture/start";
    const data = {
      lecture_id: this.state.selectedLecture,
      ttl: this.state.codeTTL,
    };

    await fetch(url, {
      method: "POST",
      headers: new Headers({
        Authorization: this.props.authToken,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    }).then(async (response) => {
      if (response.status !== 200) {
        this.setState({
          startLectureStatus: response.status,
        });
      }

      const json = await response.json();

      this.setState({
        startLectureStatus: response.status,
        generatedCode: json.code,
        timeRemaining: data.ttl,
      });
    });
  }

  generateMessage(statusCode) {
    var message;
    switch (statusCode) {
      case 200:
        message = "";
        break;
      case 400:
        message = "Lecture or Time To Live was formatet incorrectly";
        break;
      case 403:
        message = "Please login as a teacher";
        break;
      case 404:
        message = "The lecture already ended";
        break;
      case 500:
        message = "Something went wrong on the server";
        break;
      default:
        message = "";
        break;
    }

    return message;
  }
}
