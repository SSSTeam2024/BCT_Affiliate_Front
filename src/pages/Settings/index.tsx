import React from 'react';
import { Container } from 'react-bootstrap';

// Import Components
import Breadcrumb from 'Common/BreadCrumb';
import PersonalInformations from './PersonalInformations';
import SocialMedia from './SocialMedia';


const Settings = () => {

    document.title = "Settings | School Administration";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumb title="Settings" pageTitle="Accounts" />

                    <PersonalInformations />
                    <SocialMedia />

                </Container>
            </div>
        </React.Fragment>
    );
}

export default Settings;