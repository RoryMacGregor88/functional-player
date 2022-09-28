import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { Grid, Button, Typography } from "@mui/material";

import { LoadMask, PageWrapper, SpacedTitle } from "@/src/components";
import { http } from "@/src/utils";

/**
 * @param {{
 *  user: object|null,
 *  updateCtx: function
 * }} props
 */
export default function ReactivationSuccess({ user, updateCtx }) {
  const router = useRouter();
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    (async () => {
      if (!!user) {
        const { email, subscriptionStatus, subscriptionId } = user;
        const {
          error,
          ok,
          user: updatedUser,
        } = await http("/auth/update-subscription-status", {
          email,
          subscriptionStatus,
          subscriptionId,
        });
        if (!!error) {
          // TODO: updatedUser returned here instead of hardcoded null?
          await http("/auth/logout");
          updateCtx({ user: null });
        } else if (ok) {
          setIsUpdated(true);
          updateCtx({ user: updatedUser });
        }
      }
    })();
  }, []);

  if (!user) {
    router.push("/dashboard");
    return <LoadMask />;
  }

  return !isUpdated ? (
    <LoadMask />
  ) : (
    <PageWrapper>
      <SpacedTitle>Success</SpacedTitle>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        gap={4}
      >
        <Typography variant="h4">
          Your subscription has been successfully reactivated.
        </Typography>
        <Typography variant="body1">
          Click the button below to return to your dashboard.
        </Typography>
        <Button onClick={() => router.push("/dashboard")}>
          Return to dashboard
        </Button>
      </Grid>
    </PageWrapper>
  );
}
