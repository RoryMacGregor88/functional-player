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

const MOCK_FAQ_DATA = new Array(20).fill(undefined).map((_, i) => ({
  question: `Question ${i + 1}`,
  answer:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea eius quia totam corporis ipsa blanditiis nulla ex deleniti, explicabo recusandae molestias, optio minima sapiente dignissimos! Fugit voluptatem officiis veritatis neque.',
  action: null,
}));

export default function FAQ(): ReactElement {
  return (
    <PageWrapper restrictWidth>
      <SpacedTitle>Frequently Asked Questions</SpacedTitle>
      {MOCK_FAQ_DATA.map(({ question, answer, action }) => (
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
