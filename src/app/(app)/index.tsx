import { Text } from "react-native";
import { Link } from "expo-router";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/context/AuthContext";
import { textStyles } from "@/theme/textStyles";

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <Screen>
      <Text style={textStyles.title}>Hello, {user?.username}</Text>
      <PrimaryButton label="Sign out" onPress={signOut} />
      <Link href="/profile" style={textStyles.link}>
        Edit profile
      </Link>
    </Screen>
  );
}
