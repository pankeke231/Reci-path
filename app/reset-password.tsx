import { useLocalSearchParams, useRouter } from "expo-router";
import ResetPasswordScreen from "@/features/auth/screens/ResetPasswordScreen";

function firstValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default function ResetPasswordRoute() {
  const router = useRouter();
  const params = useLocalSearchParams();

  return (
    <ResetPasswordScreen
      code={firstValue(params.code)}
      error={firstValue(params.error)}
      errorDescription={firstValue(params.error_description)}
      onFinished={() => router.replace("/(auth)/auth")}
      onRequestNewLink={() => router.replace("/(auth)/auth")}
    />
  );
}
