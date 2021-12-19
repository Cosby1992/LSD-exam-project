import React, { Component } from "react";
import '../styles/SelectLectureDropDown.css';
import arrowDownSvg from '../images/arrow-down.svg';

export default class SelectLectureDropDown extends Component {

    constructor(props) {
        super(props);

        this.state = {
            opened: false,
        }

        this.toggleSelect = this.toggleSelect.bind(this);
    }

    findLectureInLectures() {
        for (let i = 0; i < this.props.data.length; i++) {
            const lecture = this.props.data[i];

            if (lecture.lecture_id === this.props.selected) {
                return lecture;
            }
        }
    }
 
    toggleSelect() {
        this.setState({
            opened: !this.state.opened,
        })
    }

    render() {

        const selectedLecture = this.props.selected === "" ? this.props.data[0] : this.findLectureInLectures(this.props.data);

        if(!this.state.opened) {

            return <div className="lecture-dropdown-item" onClick={this.toggleSelect}>
                <div>
                    <h6 className="lecture-name-text">{selectedLecture.lecture_name}</h6>
                    <p className="dropdown-time-text">Start: {selectedLecture.lectureStartTimestamp}</p>
                    <p className="dropdown-time-text">End: {selectedLecture.lectureEndTimestamp}</p>
                </div>

                <img className="arrow-down" src={arrowDownSvg} alt="arrow down"></img>

            </div>

        }

        return <div>
                    <div className="dropdown-container">
                        {this.props.data.map((lecture, index) => {
                            return <div className="lecture-dropdown-item" key={index} onClick={() => {this.props.setSelected(lecture.lecture_id); this.toggleSelect()}}>
                                <div>
                                    <h6 className="lecture-name-text">{lecture.lecture_name}</h6>
                                    <p className="dropdown-time-text">Start: {lecture.lectureStartTimestamp}</p>
                                    <p className="dropdown-time-text">End: {lecture.lectureEndTimestamp}</p>
                                </div>
                            </div>
                        })}
                    </div>

                </div>


    }
}