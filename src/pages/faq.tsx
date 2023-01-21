import { ReactElement } from 'react';

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';

import { PageWrapper, SpacedTitle, ExpandIcon } from '@/src/components';

import { FAQ_DATA } from '@/src/utils/constants';

export default function FAQ(): ReactElement {
  return (
    <PageWrapper restrictWidth>
      <SpacedTitle>Frequently Asked Questions</SpacedTitle>
      {FAQ_DATA.map(({ question, answer }) => (
        <Accordion key={question} sx={{ width: '100%', margin: '0.5rem 0' }}>
          <AccordionSummary
            expandIcon={<ExpandIcon />}
            aria-controls='faq-content'
            id='panel1a-header'
          >
            <Typography variant='h4' style={{ fontSize: '1.5rem' }}>
              {question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant='body1'>{answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </PageWrapper>
  );
}
