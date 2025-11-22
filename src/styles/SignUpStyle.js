import { StyleSheet } from "react-native";

const SignUpStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    paddingBottom: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    color: "black",
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#007AFF",
    fontWeight: "500",
  },
});

export default SignUpStyle;