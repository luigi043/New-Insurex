import React from 'react';
import { Container, Box, useMediaQuery, useTheme } from '@mui/material';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disableGutters?: boolean;
  sx?: any;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'lg',
  disableGutters = false,
  sx = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const getPadding = () => {
    if (isMobile) return 2;
    if (isTablet) return 3;
    return 4;
  };

  return (
    <Container
      maxWidth={maxWidth}
      disableGutters={disableGutters}
      sx={{
        px: disableGutters ? 0 : getPadding(),
        ...sx,
      }}
    >
      <Box
        sx={{
          width: '100%',
          minHeight: '100%',
        }}
      >
        {children}
      </Box>
    </Container>
  );
};
