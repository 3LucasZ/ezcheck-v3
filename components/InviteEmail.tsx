import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  render,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type InviteEmailProps = {
  receiverEmail: string;
  senderEmail: string;
  senderName: string;
  senderImage?: string; //might not be a good idea
};
export default function InviteEmail(props: InviteEmailProps) {
  //pre
  const baseUrl = "https://localhost:3000";

  //mid
  const invitedByEmail = "alan.turing@example.com";
  const teamName = "Enigma";
  const teamImage = `${baseUrl}/images/logo.png`;
  const inviteLink = `${baseUrl}/`;

  return (
    <Html>
      <Head />
      <Preview>{"An EZCheck account has been created for you"}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/images/logo.png`}
                width="75"
                alt="Vercel"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Welcome to{" "}
              <strong className="text-orange-400">{"EZCheck"}</strong>
              {/* on <strong>Vercel</strong> */}
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {props.receiverEmail},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>{props.senderEmail}</strong> (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              ) has invited you to the <strong>{teamName}</strong> team on{" "}
              <strong>Vercel</strong>.
            </Text>
            <Section>
              <Row>
                <Column align="center">
                  <Img
                    src={`${baseUrl}/static/vercel-arrow.png`}
                    width="12"
                    height="9"
                    alt="invited you to"
                  />
                </Column>
                <Column align="left">
                  <Img
                    className="rounded-full"
                    src={teamImage}
                    width="64"
                    height="64"
                  />
                </Column>
              </Row>
            </Section>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={inviteLink}
              >
                Finish registration
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This invitation was intended for{" "}
              <span className="text-black">{props.receiverEmail}</span>. This
              invite was sent from{" "}
              <span className="text-black">{"Valley Christian Schools"}</span>{" "}
              located in{" "}
              <span className="text-black">{"San Jose, California"}</span>. If
              you were not expecting this invitation, you can ignore this email.
              If you are concerned about your account's safety, please reply to
              this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
export function GetInviteEmailHtml(props: InviteEmailProps) {
  return render(<InviteEmail {...props} />);
}
