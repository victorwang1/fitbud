import React, { Component } from 'react';
import { Container, Grid, Header, Image, Segment, Button, Transition, Label, Message, Checkbox, Radio, Sidebar, Menu, Icon} from 'semantic-ui-react';
import { Form, Input, TextArea, Select } from 'formsy-semantic-ui-react';
import _ from 'lodash';

// import { Card, Container, Icon, Image, List } from 'semantic-ui-react';

class CreateListing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      submit: false,
      formData: null,
      private: false,
      event: [1,2,3,4,5,9,'a'],
      currentEvent: 1,
      currentLevel: 'Intermediate',
      level: ['Beginner','Intermediate','Advanced']
    }

    this.options = _.range(1, 11).map(num => {
      return {
        key: num,
        text: num > 1 ? num + ' buddies' : num + ' buddy',
        value: num
      }
    })
  }

  componentDidMount() {
    this.setState({
      visible: true
    });
  }

  toggleVisibility = () => {
    this.setState({private: !this.state.private});
  }

  changeEvent = (index) => {
    this.setState({currentEvent: index});
  }

  handleLevelClick = (e) => {
    e.preventDefault();
    this.setState({currentLevel: e.target.innerHTML});
  }

  onValidSubmit = (formData) => {
    this.setState({submit: true});
    formData.currentLevel = this.state.currentLevel;
    formData.currentEvent = this.state.currentEvent;
    formData.private = this.state.private;
    formData.date = new Date(formData.date).toISOString().slice(0, 19).replace('T', ' ');
    var options = {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(formData)
    }

    fetch('/postings', options)
      .then(response => {
        if (response.ok) {
          this.props.history.replace('/listings');
        } else {
          this.setState({
            errorHeader: 'Error encountered',
            errorContent: 'Please try again',
            formError: true,
            submit: false
          })
        }
      })
  };

  componentDidMount() {
    this.setState({visible: true})
  }

  render() {
    const styles = {
      root: {
        marginTop: 18,
        // padding: '0 24px 24px 24px',
      },

      customErrorLabel: {
        color: '#f00',
        textAlign: 'center',
      },
    };

    const errorLabel = <Label color="red" pointing/>;

    const titleInput = (
      <Input
        name="title"
        placeholder="Title"
        type='text'
        icon="sticky note"
        iconPosition="left"
        required
        validations={{
          minLength: 4,
          maxLength: 50,
          isWords: true
        }}
        validationErrors={{
          minLength: 'Minimum of 4 characters',
          maxLength: 'Maximum of 50 characters',
          isDefaultRequiredValue: 'Title is required',
          isWords: 'Only letters allowed for title'
        }}
        errorLabel={ <Label basic color='red' pointing /> }
      />
    );

    const locationInput = (
      <Input
        name="location"
        placeholder="Workout location"
        type='text'
        icon="map"
        iconPosition="left"
        required
        validations={{
          isWords: true
        }}
        validationErrors={{
          isDefaultRequiredValue: 'Location is required',
          isWords: 'Only letters allowed for location'
        }}
        errorLabel={ <Label basic color='red' pointing /> }
      />
    );

    const meetupInput = (
      <Input
        name="meetup_point"
        placeholder="Meeting point"
        type='text'
        icon="point"
        iconPosition="left"
        required
        // validations={{
        //   isWords: true
        // }}
        validationErrors={{
          isDefaultRequiredValue: 'Meeting point is required',
          isWords: 'Only words allowed for meeting point'
        }}
        errorLabel={ <Label basic color='red' pointing /> }
      />
    );

    const dateInput = (
      <Input
        name="date"
        placeholder="Date MM/DD/YYYY"
        type='text'
        icon="calendar"
        iconPosition="left"
        required
        validationErrors={{
          isDefaultRequiredValue: 'Date is required'
        }}
        errorLabel={ <Label basic color='red' pointing /> }
      />
    );

    const durationInput = (
      <Input
        name="duration"
        placeholder="Duration in hours"
        type='text'
        icon="clock"
        iconPosition="left"
        required
        validationErrors={{
          isDefaultRequiredValue: 'Duration is required'
        }}
        errorLabel={ <Label basic color='red' pointing /> }
      />
    );

    const buddiesInput = (
      <Select
        name="buddies"
        options={ this.options }
        placeholder="Number of buddies"
        required
        errorLabel={ <Label basic color='red' pointing /> }
        validationErrors={{
          isDefaultRequiredValue: 'Buddies are required',
        }}
      />
    )

    const toggleInput = (
      <div style={{'paddingBottom':'20px'}}>
        <Radio  slider label={this.state.private ? 'Public' : 'Private'} onChange={this.toggleVisibility} />
      </div>
    )

    const sectionInput = (
      <Grid style={{'padding':'10px'}}>
        <Grid.Row columns={this.state.event.length}>
          { this.state.event.map((ele,index) =>
            <Grid.Column>
              <Image
                key={index}
                height="36"
                width="36"
                src={
                  this.state.currentEvent !== index ?
                  `${ele}.svg`
                  : `${ele}_on.svg`
                }
                onClick={this.changeEvent.bind(this,index)}
              />
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    )


    const detailsInput = (
      <TextArea
        name="details"
        type='text'
        required
        placeholder="Details for the event"
        validations={{
          minLength: 10
        }}
        validationErrors={{
          minLength: 'Minimum of 10 characters',
          isDefaultRequiredValue: 'Details are required'
        }}
        errorLabel={ <Label basic color='red' pointing /> }
      />
    );

    return (
      <Transition visible={this.state.visible} animation='fade' duration={1000}>
        <div className='login-form'>
          <style>{`
            body > div,
            body > div > div,
            body > div > div > div.login-form {
              height: 90%;
            }
          `}</style>
          <Grid
            width={4}
            textAlign='center'
            style={{ height: '100%',
                     marginTop: '3em',
                     paddingLeft: '10em',
                     marginBottom: '3em' }}
          >
            <Grid.Column width={16} style={{ maxWidth: 550 }}>
              <Header as='h2' color='teal' textAlign='center'>
                Find your next buddy
                </Header>
              <Segment raised>
              <Form size='large'
                    error={this.state.formError}
                    noValidate
                    onValidSubmit={this.onValidSubmit}
              >
                { titleInput }
                { locationInput }
                <Form.Group widths='equal'>
                  { meetupInput }
                  { dateInput }
                </Form.Group >
                <Form.Group widths='equal'>
                  { durationInput }
                  { buddiesInput }
                </Form.Group >
                <Segment attached='bottom'>
                  { sectionInput }
                  <div style={{'padding':'20px'}}>
                     <Button.Group >
                      {
                        this.state.level.map((ele,index) =>
                          this.state.currentLevel === ele ?
                          <Button key={index} passive onClick={this.handleLevelClick} style={{'background-color':'gray','color':'white'}}>{ele}</Button>
                          : <Button key={index} onClick={this.handleLevelClick}>{ele}</Button>
                        )
                      }
                    </Button.Group>
                  </div>
                  { toggleInput }
                </Segment>
                { detailsInput }
                <Button loading={this.state.submit} color='teal' size='large' fluid>CREATE LISTING</Button>
                <Message error
                         header={this.state.errorHeader}
                         content={this.state.errorContent}
                />
              </Form>
              </Segment>
            </Grid.Column>
            <Grid.Column width={3}>
                <Transition visible={this.state.private} animation='slide right' duration={200}>
                  <div style={{'paddingTop':'50px'}}>
                    <Segment raised>
                      <Header as='h3' color='teal' textAlign='center'>
                        Friends List
                      </Header>
                      <div display='hidden' style={{'height':'565px','overflowY': 'scroll', 'overflowX': 'hidden'}}>
                      </div>
                    </Segment>
                  </div>
                </Transition>
            </Grid.Column>
          </Grid>
        </div>
      </Transition>
    )
  }
}

export default CreateListing
