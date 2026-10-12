import React from 'react';
import PageHeader from '../components/common/PageHeader';
import WelcomeAbout from '../components/home/WelcomeAbout';

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        badge="T.P. COLLEGE MADHEPURA"
        title="About"
        highlight="Our Department"
        description="Thakur Prasad College is a constituent unit of B.N. Mandal University. Its Department of Computer Application prepares students with academic foundations and practical skills for the evolving world of computing."
        breadcrumbs={[
          { label: 'About' },
        ]}
      />
      <WelcomeAbout />
    </div>
  );
}
