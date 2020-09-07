import React, { Component } from "react";
import "./completeIdentification.css";
import { Form, Typography, Button, Carousel, Icon, Upload, notification } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import { CLAIM_USER } from '../../constants';
import {isMobile} from 'react-device-detect';

const FormItem = Form.Item;
const { Title } = Typography;
const uuidv4 = require("uuid/v4");
const { Dragger } = Upload;

var sliderStep = 1;

class CompleteIdentification extends Component {
  constructor(props) {
    super(props);

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.carousel = React.createRef();

    this.state = {
      isLastStep: false,
      canShowPrevStep: true,
      canShowNextStep: false
    };

    notification.config({
      placement: "topRight",
      top: 70,
      duration: 3,
    });
  }

  next() {
    this.carousel.next();
    sliderStep++;
    this.changeStep(); 
  }

  changeStep() {
    this.setState({ canShowPrevStep: (sliderStep <= 1) });
    this.setState({ canShowNextStep: (sliderStep >= 3) });
  }

  previous() {
    this.carousel.prev();
    sliderStep--;
    this.changeStep();
  }

  isFormInvalid() {
    
  }

  sendAPIRequest = () => {
    
  };

  showButtonSave() {
    return this.state.isLastStep ? "block" : "none";
  }

  isPrevStepAvailable() {
    return this.state.canShowPrevStep;
  }

  isNextStepAvailable() {
    return this.state.canShowNextStep;
  }

  render() {
    const props = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    const propsFileUpload = {
      name: 'file',
      multiple: true,
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            notification.success({
              message: "Evliion App",
              description: `${info.file.name} file uploaded successfully.`
            });
        } else if (status === 'error') {
          notification.error({
            message: "Evliion App",
            description: `${info.file.name} file upload failed.`
          });
        }
      },
    };

    function getUploadStepTwo() {
      if(!isMobile) {
        return(
                <Dragger {...propsFileUpload}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                    band files
                  </p>
                </Dragger>
        )
      } else {
        return(
          <div><h3>Place here mobile actions</h3></div>
        );
      }
    }

    return (
      <div className="new-addvehicle-container">
          <Title level={3}>Complete Identification</Title>
          <br />
          <Form onSubmit={this.handleSubmit} className="signup-form">
              <FormItem>
                <Carousel effect="fade" ref={node => (this.carousel = node)} {...props}>
                  <div>
                    <div className="card-identification">
                    </div>
                    <div className="text-step">
                      <h3>Get ID document ready</h3>
                      <p>
                        Before you start, make sure your passport, driver's license is with you will need to scan it during the process.
                      </p>
                    </div>
                  </div>
                  <div>
                    {getUploadStepTwo()}
                    <div className="text-step">
                      <h3>Upload Photo</h3>
                      <p>
                        Your face has to be well it, make sure you don't have any background lights.
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3>3</h3>
                  </div>
                </Carousel>
              </FormItem>
              <FormItem style={{textAlign: "center"}}>
                <Button type="info" 
                  htmlType="button" 
                  size="large" 
                  className="signup-form-button"
                  disabled={this.isPrevStepAvailable()}
                  style={{marginRight: "1rem"}}
                  onClick={this.previous}>
                  Prev <Icon type="left-circle" />
                </Button>
                <Button type="info" 
                  htmlType="button" 
                  size="large" 
                  className="signup-form-button"
                  disabled={this.isNextStepAvailable()}
                  onClick={this.next}>
                  Next <Icon type="right-circle" />
                </Button>
              </FormItem>
                <FormItem>
                <Button type="primary" 
                  htmlType="submit" 
                  size="large"
                  style={{display: this.showButtonSave()}}
                  className="signup-form-button"
                  onClick={this.sendAPIRequest}
                  disabled={this.isFormInvalid()}>
                  Save
                </Button>
              </FormItem>
          </Form>
      </div>
    );
  }
}
export default CompleteIdentification;