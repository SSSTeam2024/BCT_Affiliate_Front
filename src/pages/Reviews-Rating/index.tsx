import BreadCrumb from 'Common/BreadCrumb';
import React from 'react'
import { Container, Row } from 'react-bootstrap';

import avatar10 from "assets/images/users/avatar-10.jpg";
import avatar8 from "assets/images/users/avatar-8.jpg";
import avatar1 from "assets/images/users/avatar-1.jpg";
import avatar4 from "assets/images/users/avatar-4.jpg";
import avatar3 from "assets/images/users/avatar-3.jpg";
import avatar5 from "assets/images/users/avatar-5.jpg";
import avatar7 from "assets/images/users/avatar-7.jpg";
import avatar9 from "assets/images/users/avatar-9.jpg";
import avatar2 from "assets/images/users/avatar-2.jpg";
import avatar6 from "assets/images/users/avatar-6.jpg";
import ReviewsRating from './Reviews&Rating';

const ReviewRating = () => {

    document.title = "Feedback & Claims | Bouden Coach Travel";

   
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Feedback & Claims" pageTitle="Dashboard" />
                    <h1>Feedback & Claims</h1>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default ReviewRating
