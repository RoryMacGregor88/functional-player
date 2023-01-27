import { ReactElement } from 'react';

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from '@mui/material';

import {
  PageWrapper,
  SpacedTitle,
  ExpandIcon,
  Link,
  LinkButton,
} from '@/src/components';

import { FAQ_DATA } from '@/src/utils/constants';

// TODO: needs tests

export default function FAQ(): ReactElement {
  return (
    <PageWrapper restrictWidth>
      <SpacedTitle>Frequently Asked Questions</SpacedTitle>
      {FAQ_DATA.map(({ question, answer, action }) => (
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
          {!!action ? (
            <Box sx={{ padding: '0 0 1rem 0.5rem' }}>
              <Link href={action.href}>
                <LinkButton>{action.label}</LinkButton>
              </Link>
            </Box>
          ) : null}
        </Accordion>
      ))}
    </PageWrapper>
  );
}
