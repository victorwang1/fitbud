import React, { Component } from 'react';
import { Card, Container, Icon, Transition, Grid, Rail } from 'semantic-ui-react';
import ListingCard from './ListingCard.js';
import ListingModal from './ListingModal.js';
import Messaging from './Messaging.js';
import ListingNav from './ListingNav.jsx';

class Listings extends Component {
  images = ['daniel.jpg', 'elliot.jpg', 'matthew.png', 'rachel.png'];
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      listings: [],
      showModal: false,
      selectedListing: null
    }
  }

  updateListings = () => {
    fetch('/postings', {
      credentials: 'include'
    }).then(response => response.json())
      .then(listings => {
        console.log('listings', listings);
        this.setState({listings: listings})
      })
  }

  componentDidMount() {
    this.setState({visible: true})
    console.log('mounting');

    this.updateListings();
  }

  showListingModal(listing) {
    this.setState({
      showModal: true,
      selectedListing: listing
    })
  }

  hideListingModal = () => {
    this.updateListings();

    this.setState({
      showModal: false,
      selectedListing: null
    })
  }

  handleContextRef = contextRef => this.setState({ contextRef })

  render() {
    var { listings, showModal, selectedListing, contextRef } = this.state;
    console.log(listings);
    console.log(this.images);

    return ([
      
      <Transition visible={this.state.visible} duration={1000} animation='fade'>

        <Container style={{marginTop: '20px'}}>
          <ListingNav user={this.props.user}/>
          <Card.Group itemsPerRow={3}>
            {listings.map(listing => (

              <ListingCard listing={listing} showListingModal={this.showListingModal.bind(this)}
                           user={this.props.user.photo}
              />
            ))}
          </Card.Group>
        </Container>
      </Transition>,
      <Container>
        {this.state.showModal && (
          <ListingModal listing={selectedListing} open={this.state.showModal}
                        hideListingModal={this.hideListingModal}
                        user={this.props.user}
                        userImage={this.props.user.photo}  />
        )}
      </Container>]
    )
  }
}

// ,
//
// <Grid centered columns={3}>
// <Grid.Column>
// <div ref={this.handleContextRef}>
// <Rail position='right'>
// <Messaging context={this.contextRef}
// style={{'position': 'absolute',
//         'bottom': '0'}}/>
// </Rail>
// </div>
// </Grid.Column>
// </Grid>

export default Listings;
