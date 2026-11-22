import { Link } from 'expo-router';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { PROBLEMS } from '@/constants/messages';
import { textStyles } from '@/theme/textStyles';

export default function NotFoundScreen() {
  return (
    <Screen>
      <EmptyState title="Page not found" message={PROBLEMS.PAGE_NOT_FOUND} />
      <Link href="/" style={textStyles.link}>
        Go to the start
      </Link>
    </Screen>
  );
}