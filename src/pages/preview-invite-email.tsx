import InviteEmail from "components/InviteEmail";
import Layout from "components/Layout/MainLayout";

export default function Main() {
  return (
    <Layout authorized={true} loaded={true}>
      <InviteEmail
        receiverName={"Teset Receiver"}
        receiverEmail={"receiver@warriorlife.net"}
        senderEmail={"sender@vcs.net"}
        senderName={"Test Sender"}
      />
    </Layout>
  );
}
