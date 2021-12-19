import React, { Component } from "react";
import '../styles/StudentView.css';

import MenuButton from "../components/MenuButton";
import InputField from "../components/InputField";
import SelectLectureDropDown from "../components/SelectLectureDropDown";
import StatisticsRadarChart from "../components/StatisticsRadarChart";

export default class StudentView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            registerPressed: false,
            statisticsPressed: false,
            inputCode: "",
            selectedLecture: "",
            lectures: [],
            registerAttendanceStatus: 0,
        }

        this.updateInputCode = this.updateInputCode.bind(this);
        this.selectRegister = this.selectRegister.bind(this);
        this.backToHome = this.backToHome.bind(this);
        this.register = this.register.bind(this);
        this.setSelectedLecture = this.setSelectedLecture.bind(this);
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

        const url = `http://localhost:3200/statistics/overall/${start.toISOString().split(".")[0]}/${end.toISOString().split(".")[0]}`;

        await fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Authorization': this.props.authToken
            })
        }).then(async response => {
            const json = await response.json();

            this.setState({
                lectures: json.statistics.lectures,
                selectedLecture: json.statistics.lectures[0].lecture_id
            })
        })

    }

    render() {

        if (this.state.registerPressed) {

            const message = this.generateMessage(this.state.registerAttendanceStatus)

            return <div className="student-outer-wrapper">
                <h1>Register Attendance</h1>

                <SelectLectureDropDown data={this.state.lectures} setSelected={this.setSelectedLecture} selected={this.state.selectedLecture}></SelectLectureDropDown>

                <InputField type="text" label="Attendance Code" value={this.state.inputCode} placeholder="Eg. a2c4" onChange={this.updateInputCode}></InputField>
                {message === "" ? null : <div className="error-message-text">{message}</div>}
                <MenuButton title="Register" function={this.register}></MenuButton>
                <MenuButton title="BACK" function={this.backToHome}></MenuButton>
            </div>
        }

        if (this.state.statisticsPressed) {
            return <div className="teacher-outer-wrapper">
    
                <h1>Student Statistics</h1>
                <StatisticsRadarChart authToken={this.props.authToken}></StatisticsRadarChart>
    
              <MenuButton title="BACK" function={this.backToHome}></MenuButton>
            </div>
        }
                

        return <div className="student-outer-wrapper">
            <h1>WELCOME STUDENT</h1>
            <MenuButton title="Register Attendance" function={this.selectRegister}></MenuButton>
            <MenuButton title="See Statistics" function={this.selectStatistics}></MenuButton>
            <MenuButton title="LOGOUT" function={this.props.logout}></MenuButton>
        </div>
    }

    selectRegister() {
        this.setState({
            registerPressed: true,
        })
    }

    selectStatistics() {
        this.setState({
          statisticsPressed: true,
        });
      }

    backToHome() {
        this.setState({
            registerPressed: false,
            statisticsPressed: false,
        })
    }

    updateInputCode(event) {
        this.setState({
            inputCode: event.target.value,
            registerAttendanceStatus: 0,
        })
    }

    setSelectedLecture(string) {
        this.setState({
            selectedLecture: string,
            registerAttendanceStatus: 0,
        })
    }

    async register() {
    
        const url = "http://localhost:3200/student/checkin";
        const data = {
            lecture_id: this.state.selectedLecture,
            attendance_code: this.state.inputCode
        };

        console.log(data);

        await fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': this.props.authToken,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(data)
        }).then(async response => {
            this.setState({
                registerAttendanceStatus: response.status,
            })
        }).catch(err => {
            console.log(err);
        }) 

    }

    generateMessage(statusCode) {
        var message;
        switch (statusCode) {
            case 200: 
                message = "You have succesfully registered your attendance in this class";
                break;
            case 208:
                message = "You are already registered in this lecture";
                break;
            case 400:
                message = "Invalid attendance code";
                break;
            case 403:
                message = "Please login as a student";
                break;
            case 404: 
                message = "The lecture is not open for registration"
                break;    
            case 500: 
                message = "Something went wrong on the server"
                break; 
            default:
                message = ""
                break;
        }

        return message;
    }

}