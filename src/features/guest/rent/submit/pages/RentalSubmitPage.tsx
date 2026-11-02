import { useCallback, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  useItemDetail,
  useSendRentalRequest,
} from "../../../../../hooks/queries/useClientQueries";
import type {
  BorrowerInformationRequest,
  ItemResponse,
} from "../../../../../api/client/client.type";
import { PageLayout } from "../../../../common/layouts/PageLayout";
import { TitleHeader } from "../../../../common/components/header/TitleHeader";
import TextField from "../../../../common/components/form/TextField";
import InformationCard from "../components/cards/InformationCard";
import ContactVerificationField from "../components/form/ContactVerificationField";
import ButtonBar from "../../../../common/components/buttons/ButtonBar";
import type { RentalVerificationCredentials } from "../hooks/useRentalVerification";
import RentalConsentCard from "../components/cards/RentalConsentCard";
import {
  Padding,
  Border,
  FormSection,
  FormTitleSection,
  Title,
  RequiredMessage,
  Fields,
  MembershipNotice,
  ConsentSection,
  Message,
  ButtonSection,
  SubmitFeedback,
} from "./RentalSubmitPage.styles";

type RentalSubmitPageProps = {
  placeName?: string;
  pageName?: string;
  itemId?: number;
  onVerificationComplete?: (credentials: RentalVerificationCredentials) => void;
};
const previewItemLabel = {
  name: "구형 노트북 충전기",
  description: "어댑터 미포함",
};

const previewInformationLabel = {
  item: "C타입 충전기 소형(3)",
  duration: { day: 3, range: "(2026.10.17 ~ 2026.10.20)" },
  guaranteedGoods: "학생증 또는 신분증",
};

type RentalRouteState = {
  itemId?: number;
  itemUnitId?: number;
  organizationId?: number;
  organizationName?: string;
  rentalItem?: ItemResponse["items"][number];
  itemUnitLabel?: string;
  guaranteedGoods?: string;
  borrowerRequirements?: { label: string; required: boolean }[];
};

const defaultBorrowerRequirements = [
  { label: "학과", required: true },
  { label: "학번", required: true },
];
const reservedLabels = new Set([
  "이름",
  "연락처",
  "전화번호",
  "이메일",
  "요청사항",
  "요청 사항",
]);
const positiveId = (value: unknown) => {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 0;
};
const RentalSubmitPage = ({
  placeName = "건국대학교 학생회관",
  pageName = "물품 대여",
  itemId: providedItemId,
  onVerificationComplete,
}: RentalSubmitPageProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routeState = location.state as RentalRouteState | null;
  const rentalItem = routeState?.rentalItem;
  const itemLabel = rentalItem
    ? { name: rentalItem.name, description: rentalItem.description }
    : previewItemLabel;
  const informationLabel = rentalItem
    ? {
        item: routeState?.itemUnitLabel ?? rentalItem.name,
        duration: {
          day: rentalItem.rentalDuration,
          range: "",
        },
        guaranteedGoods: rentalItem.guaranteedGoods?.trim() || "없음",
      }
    : previewInformationLabel;
  const requestedItemId = Number(
    providedItemId ?? routeState?.itemId ?? searchParams.get("itemId") ?? 0,
  );
  const itemId =
    Number.isSafeInteger(requestedItemId) && requestedItemId > 0
      ? requestedItemId
      : 0;
  const itemDetail = useItemDetail(itemId, itemId > 0);
  const itemUnitId = positiveId(
    routeState?.itemUnitId ?? searchParams.get("itemUnitId"),
  );
  const organizationId = positiveId(
    routeState?.organizationId ?? searchParams.get("organizationId"),
  );
  const isMembershipReady =
    itemId === 0 || (!itemDetail.isPending && !itemDetail.isError);
  // 공개 물품 상세의 level은 해당 물품을 소유한 대여지의 멤버십이다.
  // 물품 없는 개발 미리보기에서만 기존 화면과 같은 이메일 전환을 지원한다.
  const verificationMethod =
    itemDetail.data?.level === "FREE" ||
    (itemId === 0 &&
      import.meta.env.DEV &&
      searchParams.get("verification") === "email")
      ? "email"
      : "phone";
  const [name, setName] = useState("");
  const [additionalFields, setAdditionalFields] = useState<
    Record<string, string>
  >({});
  const [request, setRequest] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [verifiedContact, setVerifiedContact] = useState<{
    scope: string;
    credentials: RentalVerificationCredentials;
  } | null>(null);
  const [submitError, setSubmitError] = useState("");
  const submitLock = useRef(false);
  const rentalRequest = useSendRentalRequest();
  const verificationScope = `${itemId}:${verificationMethod}`;
  const handleVerificationChange = useCallback(
    (credentials: RentalVerificationCredentials | null) => {
      setVerifiedContact(
        credentials ? { scope: verificationScope, credentials } : null,
      );
    },
    [verificationScope],
  );
  const credentials =
    verifiedContact?.scope === verificationScope
      ? verifiedContact.credentials
      : null;
  const isContactVerified =
    credentials !== null &&
    (verificationMethod === "email"
      ? "email" in credentials &&
        Boolean(
          credentials.email.trim() && credentials.emailVerificationToken.trim(),
        )
      : "phone" in credentials &&
        Boolean(
          credentials.phone.trim() &&
          credentials.tokenId.trim() &&
          credentials.rawToken.trim(),
        ));
  const borrowerRequirements = (
    itemDetail.data?.borrowerRequirements ??
    routeState?.borrowerRequirements ??
    defaultBorrowerRequirements
  ).filter(
    (field, index, fields) =>
      !reservedLabels.has(field.label) &&
      fields.findIndex((candidate) => candidate.label === field.label) ===
        index,
  );
  const hasRequiredFields =
    Boolean(name.trim()) &&
    borrowerRequirements.every(
      ({ label, required }) =>
        !required || Boolean(additionalFields[label]?.trim()),
    );
  const hasSelectedUnit =
    itemDetail.data?.itemManagementType !== "UNIT" ||
    Boolean(
      itemUnitId &&
      itemDetail.data.itemUnits?.some((unit) => unit.itemUnitId === itemUnitId),
    );
  const canSubmit =
    itemId > 0 &&
    isMembershipReady &&
    isContactVerified &&
    hasRequiredFields &&
    consentChecked &&
    hasSelectedUnit &&
    !rentalRequest.isPending &&
    !rentalRequest.isSuccess;
  const guaranteedGoods =
    routeState?.guaranteedGoods ?? informationLabel.guaranteedGoods;
  const consentDescription = `대여 물품 연체 시 ${verificationMethod === "email" ? "이메일" : "카카오톡"}으로 반납 안내가 발송됩니다.${
    guaranteedGoods && guaranteedGoods !== "없음" && guaranteedGoods !== "-"
      ? ` 대여 시 담보 물품으로 ${guaranteedGoods}을 맡겨야 하며, 맡기신 물품은 대여 물품 반납 시 돌려드립니다.`
      : ""
  }`;

  const handleSubmit = async () => {
    if (!canSubmit || !credentials || submitLock.current) return;
    submitLock.current = true;
    setSubmitError("");
    const body: BorrowerInformationRequest = {
      itemUnitId: itemUnitId || null,
      name: name.trim(),
      requestNote: request.trim().slice(0, 30) || undefined,
      renterFields: Object.fromEntries(
        borrowerRequirements
          .map(({ label }) => [label, additionalFields[label]?.trim() ?? ""])
          .filter(([, value]) => value !== ""),
      ),
      ...credentials,
    };
    try {
      const response = await rentalRequest.mutateAsync({ itemId, ...body });
      const params = new URLSearchParams();
      if (positiveId(response.rentalId))
        params.set("rentalId", String(response.rentalId));
      if (organizationId) params.set("organizationId", String(organizationId));
      const query = params.toString();
      navigate(`/client-rental-confirmation${query ? `?${query}` : ""}`, {
        replace: true,
      });
    } catch (error) {
      setSubmitError(
        isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message ||
              "대여 요청에 실패했습니다. 다시 시도해주세요."
          : "대여 요청에 실패했습니다. 다시 시도해주세요.",
      );
    } finally {
      submitLock.current = false;
    }
  };

  return (
    <PageLayout>
      <TitleHeader
        placeName={routeState?.organizationName ?? placeName}
        pageName={pageName}
        onClick={() => navigate(-1)}
      />
      <Padding>
        <InformationCard
          itemLabel={itemLabel}
          informationLabel={informationLabel}
        />
      </Padding>

      <FormSection aria-labelledby="rental-borrower-title">
        <FormTitleSection>
          <Title id="rental-borrower-title">대여자 정보 입력</Title>
          <RequiredMessage>*답변 필수</RequiredMessage>
        </FormTitleSection>
        <Fields>
          <TextField
            label="이름"
            name="borrowerName"
            placeholder="홍길동"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          {itemId > 0 && itemDetail.isError ? (
            <MembershipNotice role="alert">
              물품 정보를 불러오지 못했습니다.
              <button type="button" onClick={() => void itemDetail.refetch()}>
                다시 시도
              </button>
            </MembershipNotice>
          ) : isMembershipReady ? (
            <ContactVerificationField
              key={`${itemId}:${verificationMethod}`}
              method={verificationMethod}
              onVerified={onVerificationComplete}
              onVerificationChange={handleVerificationChange}
            />
          ) : (
            <MembershipNotice role="status">
              인증 방식을 확인하고 있습니다.
            </MembershipNotice>
          )}
          {borrowerRequirements.map(({ label, required }) => (
            <TextField
              key={label}
              label={label}
              name={
                label === "학과"
                  ? "department"
                  : label === "학번"
                    ? "studentNumber"
                    : label
              }
              inputMode={label === "학번" ? "numeric" : undefined}
              placeholder={
                label === "학과"
                  ? "경영학과"
                  : label === "학번"
                    ? "202600000"
                    : `${label} 입력`
              }
              required={required}
              value={additionalFields[label] ?? ""}
              onChange={(event) => {
                const value =
                  label === "학번"
                    ? event.target.value.replace(/\D/g, "")
                    : event.target.value;
                setAdditionalFields((fields) => ({
                  ...fields,
                  [label]: value,
                }));
              }}
            />
          ))}
          <TextField
            label="요청사항"
            name="request"
            hint={`${request.length}/30자`}
            placeholder="ex. 반납기한 연장"
            multiline
            rows={1}
            maxLength={30}
            value={request}
            onChange={(event) => setRequest(event.target.value)}
          />
        </Fields>
      </FormSection>
      <Border />
      <Padding>
        <ConsentSection>
          <Title>대여 유의 사항</Title>
          <RentalConsentCard
            description={consentDescription}
            checked={consentChecked}
            disabled={rentalRequest.isPending || rentalRequest.isSuccess}
            onChange={setConsentChecked}
          />
          <Message>관리자 승인 후 대여가 완료됩니다.</Message>
        </ConsentSection>
        <ButtonSection>
          {/* {!itemId && (
            <SubmitFeedback role="status">
              대여할 물품을 선택해주세요.
            </SubmitFeedback>
          )} */}
          {itemId > 0 && !hasSelectedUnit && (
            <SubmitFeedback role="status">
              대여할 세부 물품을 선택해주세요.
            </SubmitFeedback>
          )}
          {submitError && (
            <SubmitFeedback role="alert">{submitError}</SubmitFeedback>
          )}
          <ButtonBar
            label={rentalRequest.isPending ? "요청 중" : "대여하기"}
            size={350}
            disabled={!canSubmit}
            onClick={() => void handleSubmit()}
          />
        </ButtonSection>
      </Padding>
    </PageLayout>
  );
};

export default RentalSubmitPage;
