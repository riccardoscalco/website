import * as React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Flex, Badge, Text, Link, Container, Button } from '@modulz/design-system';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { ScrollArea } from './ScrollArea';
import { allPrimitivesRoutes, primitivesRoutes, RouteProps } from '@lib/primitivesRoutes';
import { NavHeading, NavItem } from './DocNav';

export function PrimitivesPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  let currentPageSlug;

  const routerSlug = router.query.slug;

  const GITHUB_URL = 'https://github.com';
  const REPO_NAME = 'radix-ui/website';
  let editUrl: string = '';

  if (typeof routerSlug === 'string') {
    currentPageSlug = router.pathname.substr(1).replace('[slug]', routerSlug);
    editUrl = `${GITHUB_URL}/${REPO_NAME}/edit/main/data/${currentPageSlug}.mdx`;
  } else {
    currentPageSlug = router.pathname.substr(1).replace('[...slug]', routerSlug[0]);
    editUrl = `${GITHUB_URL}/${REPO_NAME}/edit/main/data/${currentPageSlug}/${routerSlug[1]}.mdx`;
  }
  editUrl = editUrl.replace('/docs', '');

  const currentPageIndex = allPrimitivesRoutes.findIndex((page) => page.slug === currentPageSlug);
  const previous = allPrimitivesRoutes[currentPageIndex - 1];
  const next = allPrimitivesRoutes[currentPageIndex + 1];

  React.useEffect(() => {
    const handleRouteChange = () => setIsOpen(false);
    router.events.on('routeChangeStart', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, []);

  return (
    <Flex
      css={{
        flexDirection: 'column',
        '@bp2': { flexDirection: 'row' },
      }}
    >
      <Box
        css={{
          width: '100%',
          maxHeight: 'auto',
          borderBottom: '1px solid',
          borderColor: '$slate6',
          WebkitOverflowScrolling: 'touch',
          overflowX: 'hidden',
          left: 0,
          top: '$sizes$7',
          position: 'fixed',
          backgroundColor: '$loContrast',
          zIndex: 1,
          ...(isOpen ? { bottom: 0 } : {}),

          '@bp2': {
            bottom: 0,
            width: '250px',
            borderRight: '1px solid',
            borderBottom: '0',
            borderColor: '$slate6',
          },
        }}
      >
        <ScrollArea>
          <Flex css={{ alignItems: 'center', py: '$2', px: '$4', '@bp2': { display: 'none' } }}>
            <Box css={{ ml: '-$1' }}>
              <Button
                ghost
                onClick={() => setIsOpen(!isOpen)}
                state={isOpen ? 'active' : undefined}
              >
                <HamburgerMenuIcon />
                <Box css={{ ml: '$2' }}>Menu</Box>
              </Button>
            </Box>
          </Flex>

          <Box
            css={{
              display: isOpen ? 'block' : 'none',
              '@bp2': { display: 'block', mt: '$4' },
            }}
          >
            {primitivesRoutes.map((section: RouteProps) => (
              <Box key={section.label} css={{ mb: '$4' }}>
                <NavHeading>{section.label}</NavHeading>
                {section.pages.map((page) => {
                  const isDraft = page.draft;
                  const isDeprecated = page.deprecated;
                  return (
                    <NavItem
                      key={page.slug}
                      href={`/${page.slug}`}
                      disabled={isDraft}
                      active={currentPageSlug === page.slug}
                    >
                      <Text size="2" css={{ color: 'inherit', lineHeight: '1' }}>
                        {page.title}
                      </Text>
                      {isDraft ? <Badge css={{ ml: '$2' }}>Coming soon</Badge> : null}
                      {isDeprecated ? (
                        <Badge variant="yellow" css={{ ml: '$2' }}>
                          Deprecated
                        </Badge>
                      ) : null}
                    </NavItem>
                  );
                })}
              </Box>
            ))}
            <Box css={{ height: '$5', '@bp2': { height: '$8' } }} />
          </Box>
        </ScrollArea>
      </Box>

      <Box
        css={{
          maxWidth: '100%',
          flex: 1,
          pt: '$8',
          pb: '$5',

          '@bp2': { pb: '$9', pl: '250px' },
          '@media (min-width: 1440px)': { pr: '250px' },
        }}
      >
        <Container size="3" css={{ maxWidth: '780px', position: 'relative' }}>
          {children}
        </Container>

        <Container size="3" css={{ maxWidth: '780px' }}>
          {(previous || next) && (
            <Flex
              aria-label="Pagination navigation"
              css={{
                justifyContent: 'space-between',
                my: '$9',
              }}
            >
              {previous && (
                <Box>
                  <NextLink href={`/${previous.slug}`} passHref>
                    <Box
                      as="a"
                      aria-label={`Previous page: ${previous.title}`}
                      css={{
                        color: '$blue11',
                        textDecoration: 'none',
                        alignItems: 'center',
                      }}
                    >
                      <Box css={{ mb: '$2' }}>
                        <Text size="3" css={{ color: '$slate11' }}>
                          Previous
                        </Text>
                      </Box>
                      <Text size="5" css={{ color: 'inherit' }}>
                        {previous.title}
                      </Text>
                    </Box>
                  </NextLink>
                </Box>
              )}
              {next && (
                <Box css={{ ml: 'auto' }}>
                  <NextLink href={`/${next.slug}`} passHref>
                    <Box
                      as="a"
                      aria-label={`Previous page: ${next.title}`}
                      css={{
                        color: '$blue11',
                        textDecoration: 'none',
                        textAlign: 'right',
                      }}
                    >
                      <Box css={{ mb: '$2' }}>
                        <Text size="3" css={{ color: '$slate11' }}>
                          Next
                        </Text>
                      </Box>
                      <Text size="5" css={{ color: 'inherit' }}>
                        {next.title}
                      </Text>
                    </Box>
                  </NextLink>
                </Box>
              )}
            </Flex>
          )}
        </Container>
        <Container size="3" css={{ maxWidth: '780px', my: '$9' }}>
          <Text size="3">
            <Link
              href={editUrl}
              title="Edit this page on GitHub."
              rel="noopener noreferrer"
              target="_blank"
              variant="subtle"
            >
              Edit this page on GitHub.
            </Link>
          </Text>
        </Container>
      </Box>
    </Flex>
  );
}
