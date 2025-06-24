# Meet Meet (1.0 ver)

<img src='https://github.com/user-attachments/assets/7dc46ff1-32ea-40e8-8237-3d53cb78d9a4' width='300' height='300' />

### 🍃 가볍게 시작하는 특별한 만남

서울의 2030이라면 **Meet Meet**에서 모임을 만들고 새로운 친구를 만들어보세요!<br/>

## 📋 목차

- [👥 팀 소개](#-팀-소개)
- [🗓️ 개발 기간](#-개발-기간)
- [🛠 기술 스택](#-기술-스택)
- [✨ 주요 기능](#-주요-기능)
- [📁 프로젝트 구조](#-아키텍처)
- [🌊 Async Surf](#-Async-Surf)
- [⚙️ 렌더링 제어](#-렌더링-제어)
- [🧐 프로덕트 엔지니어링](#-프로덕트-엔지니어링)
- [🎯 스프린트 회고](#-스프린트-회고)
- [🙌 Thanks to](#-Thanks-to)

## 👥 팀 소개

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/window-ook">
          <img src="https://avatars.githubusercontent.com/u/112608822?v=4" width="100px;" alt="" style='border-radius:50%'/><br />
          <sub>
            <b>이창욱(window-ook)</b>
          </sub>
        </a><br />
        <sub><b>영남대 경영학과 17</b></sub><br />
        <sub><b>FE</b></sub>
      </td>
      <td align="center">
        <a href="https://github.com/OhSSangHoon">
          <img src="https://avatars.githubusercontent.com/u/114225559?v=4" width="100px;" alt="" style='border-radius:50%'/><br />
          <sub>
            <b>오상훈(OhSSangHoon)</b>
          </sub>
        </a><br />
        <sub><b>영남대 컴퓨터공학과 18</b></sub><br />
        <sub><b>FE</b></sub>
      </td>
    </tr>
  </tbody>
</table>

## 📝 개발 기간

2025.05.15 ~ 2025.06.22

## 🛠 기술 스택

<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=Next.js&logoColor=white"> 
    <img src="https://img.shields.io/badge/React.js-61DAFB?style=flat-square&logo=React&logoColor=black">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/React Query-FF4154?style=flat-square&logo=reactquery&logoColor=white">
    <img src="https://img.shields.io/badge/Context API-61DAFB?style=flat-square&logo=React&logoColor=black">
    <img src="https://img.shields.io/badge/React Hook Form-EC5990?style=flat-square&logo=react-hook-form&logoColor=white">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat-square&logo=TailwindCSS&logoColor=white">
    <img src="https://img.shields.io/badge/shadcn/ui-000000?style=flat-square&logo=shadcn/ui&logoColor=white">
    <img src="https://img.shields.io/badge/Lucide-F56565?style=flat-square&logo=lucide&logoColor=white">
    <img src="https://img.shields.io/badge/Motion-000000?style=flat-square&logo=motion&logoColor=white">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/zod-3E67B1?style=flat-square&logo=zod&logoColor=white">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white">
    <img src="https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=red">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white">
    <img src="https://img.shields.io/badge/MSW-FF6A33?style=flat-square&logo=mockserviceworker&logoColor=black">
</div>
<div style='display:flex; align-items:center'>
    <img src="https://img.shields.io/badge/Git Actions-2088FF?style=flat-square&logo=github&logoColor=white"> 
    <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white"> 
</div>

## ✨ 주요 기능

### 1. 모임 찾기

<img src="https://github.com/user-attachments/assets/fd40f96e-ef43-4367-b871-b90d64ff382a" width="470px" height='360px'/>

다른 사용자들이 게시한 모임을 둘러볼 수 있습니다. 모임은 카테고리가 있고, 필터링으로 원하는 조건의 모임을 찾을 수 있습니다.

- 북적북적: 외향적인 / 활동적인 성격을 가진 모임입니다! 하위 카테고리로 엔터테인먼트 / 액티비티가 있습니다.
  - 엔터테인먼트 ex: 스포츠 관람, 공연 관람, 축제 참가, 다같이 모여서 맥주 한잔 등
  - 액티비티 ex: 풋살, 농구, 러닝 크루, 실내 사격, 클라이밍 등
- 도란도란: 내향적인 성격을 가진 모임입니다!
  - ex: 같이 카공하기, 취미 모임, 독서 모임 등

### 2. 모임 상세 정보 확인

<img src="https://github.com/user-attachments/assets/b834b8ba-3e45-443a-959c-3949ebb6d8b5" width="480px" height='360px'/>

모임에 누가 참여하고 있는지 확인하고, 다른 사용자가 남긴 리뷰도 확인할 수 있습니다. 그리고 참여도 가능합니다.

### 3. 모임 만들기

<img src="https://github.com/user-attachments/assets/bf644220-2804-4625-ae78-d167b7538217" width="440px" height='360px'/>

원하는 조건의 모임을 생성할 수 있습니다.

### 4. 찜한 모임 확인

<img src="https://github.com/user-attachments/assets/584dd523-062e-4919-9bb7-1f09400960b9" width="480px" height='360px'/>

모임 찾기, 모임 상세 정보 페이지에서 찜한 모임들을 확인할 수 있습니다.

### 5. 모든 리뷰 확인

<img src="https://github.com/user-attachments/assets/1ed6be74-0d61-4a2c-ba84-f37dc562fc55" width="470px" height='360px'/>

모든 모임의 리뷰 히스토리를 확인할 수 있습니다.

### 6. 마이페이지

**참여중인 모임**

<img src="https://github.com/user-attachments/assets/9980fb91-bb97-4f14-a909-2fbb0dbf72d4" width="460px" height='360px'/>

현재 로그인한 계정으로 참여한 모임의 목록을 볼 수 있습니다.

<img src="https://github.com/user-attachments/assets/2f2f9f6f-be3d-431c-8f9d-9911621871c6" width="520px" height='360px'/>

- 모집 마감 여부 / 이용 여부 / 개설 상태를 확인할 수 있습니다.
- 리뷰를 남기거나 참여를 취소할 수 있습니다.

**나의 리뷰**

<img src="https://github.com/user-attachments/assets/3d61550a-7cab-425f-95ed-367de9bba82c" width="460px" height='360px'/>
<img src="https://github.com/user-attachments/assets/0589a9be-2d86-4ed2-a0bc-896cde68141d" width="460px" height='360px'/>

- 참여한 모임 중에서 리뷰 작성이 가능한 모임, 이미 작성한 리뷰를 필터링하여 볼 수 있습니다.

**내가 만든 모임**

<img src="https://github.com/user-attachments/assets/26a708d4-8774-4cf5-b284-92440a463a24" width="470px" height='360px'/>

- 내가 만든 모임 중 모집 취소되지 않은 모임을 확인할 수 있습니다.

## 📁 프로젝트 구조

### Feature Based Architecture

```
📁 components
    ├── 🔐 auth
    ├── 👥 gatherings
    ├── 📄 mypage
    ├── ⭐ reviews
    ├── 💾 saved
    ├── shadcn-ui
    └── 🌐 shared

🪝 hooks/api
    ├── 👥 gatherings
    ├── 📄 mypage
    ├── ⭐ reviews
    └── 💾 saved

⚖️ utils
    ├── 🔐 auth
    ├── 👥 gatherings
    ├── 📄 mypage
    ├── ⭐ reviews
    └── 🌐 shared
```

**components**<br>
UI와 클라이언트 로직을 담당하는 컴포넌트들이 위치합니다.

**hooks/api**<br>
Tanstack Query에서 제공하는 Hook에 기반된 커스텀 Hooks입니다.
이는 `Async Surf`의 주요 구성요소로 역할을 하기도 합니다. 자세한 설명은 아키텍처 설명에 있습니다.

**utils**<br>
유틸리티 함수가 대부분을 차지하고, 극히 일부 유효성 검사 목적의 스키마나 상수도 포함되어있습니다.
컴포넌트에 위치할 필요가 없고 순수 함수의 성격을 띌 수 있으면서 분리가 가능한 함수는 이곳에 위치합니다.

### 특이사항?

`components`, `hook/api`, `utils`에 위한 `shared`는 global, common과 동일한 의미를 가진 디렉토리입니다.
'전역에서 Feature에 구애받지 않고 참조하여 사용할 수 있는' 재사용 컴포넌트가 위치합니다.<br>

이를 제외한 나머지 디렉토리는 모두 역할 기반의 디렉토리입니다.
이 중 `gatherings`만 내부에 `shared` 디렉토리를 2nd detph로 가지고 있습니다.

> 왜일까요?

```
👥 gatherings
    ├── detail
    │     ├── Footer
    │     ├── GatheringDetail
    │     └── ...
    │
    ├── shared
    │     └── JoinedCountsProgressBar
    │
    ├── CreateGatheringDialog
    ├── DateTimePick
    └── ...
```

`gatherings`는 모임 찾기, 모임 상세 페이지를 포함한 Feature입니다.
페이지 경로 또한 `gatherings/detail`로 gatherings의 하위 엔드포인트입니다.
따라서 찾기와 상세에서 공통 재사용되는 컴포넌트와 페이지별 따로 쓰는 컴포넌트를 구분하기 위해 내부 `shared`가 하나 존재합니다.

### 구조 채택의 근거

> FSD 도입은 글쎄? '**호미로 막을걸 가래로 막는다**'

이번 프로젝트는 시간 제한과 요구사항이 명확한 프로젝트였습니다.
또한, 전체 경로 수나 앱이 가진 기능이 소~중 규모에 가깝기에 모두 익숙하면서 러닝커브가 낮은 구조가 적절하다고 판단했습니다.

### 결과

공통적으로 사용되는 컴포넌트를 어디에 위치시켜야 할지 기준이 명확해 혼선이 없었습니다.
따라서 컴포넌트 모듈화, 유틸리티 함수의 증가에 따른 파일의 확장이 생겨도 배치에 관해서 소모되는 시간이 거의 없었습니다.
덕분에 협업 기준으로 팀의 DX가 매우 쾌적했고, 제한된 기간에 요구사항을 모두 충족하면서 디테일까지 추가할 수 있었습니다.

## 🌊 Async Surf

> ### 클라이언트 / 서버 컴포넌트별 비동기 통신 최적화 아키텍처

<img src="https://github.com/user-attachments/assets/1f5ce19b-3113-4c67-b3f6-94267fd04865" width="800px" height='450px'/>

### 구성 요소

**1. API Paths Station**

클라이언트와 Next.js 서버에서 내외부 통신을 위한 API의 경로를 중앙화하기 위해 정의한 객체의 모임입니다.

- `EXTERNAL_PATHS`: API 라우트 → 백엔드 / 서버 액션 → 백엔드로의 외부 통신을 위한 경로를 저장한 객체입니다.
- `INTERNAL_PATHS`: 클라이언트 → API 라우트로의 외부 통신을 위한 경로를 저장한 객체입니다.

**2. Queries Station**

Tanstack Query에서 제공하는 Hook에 기반된 커스텀 Hook의 queryKey를 중앙화하기 위해 정의한 객체의 모임입니다.
Feature Based로 파일들이 분할되어있으며, FSD에서 제공하는 `Query Factory` 패턴을 카피했습니다.
`FSD 안 쓴다며?` 네 FSD는 쓰지 않지만 중앙화의 도구로써 Async Surf의 유지보수와 확장성에 기여할 수 있기에 사용했습니다.

**3. API Hooks (based on Tanstack Query)**

Tanstack Query에서 제공하는 Hook에 기반된 커스텀 Hooks입니다.
이번 프로젝트에서는 클라이언트 컴포넌트에서 API 라우트를 거쳐 요청을 보내는 비동기 통신이 중심이었습니다.
따라서 `useQuery`, `useInfiniteQuery`, `useMutation`이 핵심 도구로써 빈번히 사용될 거라 생각했고,
커스텀 Hook으로 모두 모듈화하는 방법을 설계했습니다.
컴포넌트에서 Tanstack Query Hook의 로직을 관리하는 것은 가독성, 중앙화, 유지보수 모두 좋지 않다고 생각합니다.

**4. Client Fetchers (based on axios)**

`axios` 기반 클라이언트 사이드 전용 내외부 통신 fetchers입니다.
`axios`를 활용한 이유는 HTTP 상태 코드 기반 자동 에러 처리, 응답 데이터의 자동 직렬화 / 역직렬화입니다.
클라이언트 비동기 통신이 주를 이루는 프로젝트에서 2명인 팀에서 제한된 시간안에 개발 속도를 빠르게 낼 수 있는 합리적인 선택이었습니다.

- `internalClient`: 요청 인터셉터, 응답 인터셉터를 적용하였습니다.
  - baseURL: 앱의 도메인입니다.
  - withCredentials: true,
  - 요청 인터셉터: JWT Access Token을 headers에 추가합니다.
  - 응답 인터셉터: `parseAxiosError`라는 에러 핸들링 함수를 이용하여 message와 status만 반환합니다.
- `externalClient`:
  - baseURL: 백엔드 API의 도메인입니다.
  - withCredentials: true,

**5. Server Fetcher (based on fetch)**

`Fetch API` 기반 서버 사이드 전용 외부 통신 fetchers입니다.
그럼 왜 서버 사이드는 `Fetch API`를 썼을까요?

- Next.js의 `cache` 옵션: 페이지 렌더링 방식을 선택할 수 있습니다. (SSG/ISR/SSR)
- `Request Memoization`: React Component Tree를 렌더링 하는 동안 같은 요청(fetch)이 반복되면, 첫 호출에만 네트워크 요청이 수행되고 이후 호출은 캐시된 결과로 반환합니다.

**6. Surf Guard**

API Hooks와 API 라우트에서 발생하는 에러를 일관되게 처리하기 위한 유틸리티 모듈입니다.

- `isErrorResponse`: 에러 응답 데이터가 예상된 형식(`ErrorResponse`)을 따르는지 검증하는 타입 가드 함수입니다.
- `handleApiError`: API 통신 중 발생한 에러를 처리하고 적절한 응답을 생성하는 함수입니다.
  - Axios 에러 처리: 서버 응답, 요청 실패, 기타 에러 상황을 구분하여 처리
  - 토큰 만료 처리: 401 상태 코드와 함께 '유효하지 않은 토큰' 메시지가 오면 '로그인이 만료되었습니다'로 변환
  - 일관된 에러 포맷: 모든 에러 응답이 `{ code, message }` 형식을 따르도록 보장

이를 통해 클라이언트가 일관된 형식의 에러 응답을 받을 수 있고, 특히 인증 관련 에러를 사용자 친화적인 메시지로 변환할 수 있습니다.

> ### Surf On Client

<img src="https://github.com/user-attachments/assets/983d4898-ba62-44c2-b7c9-0ad7ce42d177" width="800px" height='450px'/>

> ### Surf On Server

<img src="https://github.com/user-attachments/assets/101a3a57-1640-4d08-8194-650365f2ce18" width="800px" height='450px'/>

## ⚙️ 렌더링 제어

### 1. React Hook Form & Zod

`SignUpForm.tsx`를 예시로 React Hook Form과 Zod 도입의 성과를 설명해보겠습니다.

> 이전 코드

- 15개의 useState로 만든 상태

```tsx
const [name, setUsername] = useState('');
const [email, setEmail] = useState('');
const [companyName, setCompanyName] = useState('');
const [password, setPassword] = useState('');
const [passwordCheck, setPasswordCheck] = useState('');
const [emailError, setEmailError] = useState(false);
const [passwordError, setPasswordError] = useState(false);
const [passwordCheckError, setPasswordCheckError] = useState(false);
const [isPasswordVisible, setIsPasswordVisible] = useState(false);
const [isPasswordCheckVisible, setIsPasswordCheckVisible] = useState(false);
const [errorResponseMessage, setErrorResponseMessage] = useState<string | null>(
  null,
);
```

- 필드마다 개별 핸들러(8개) 구현

```tsx
const handleUsernameValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
  /* 5줄 */
};
const handleEmailValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
  /* 5줄 */
};
const handlePasswordValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
  /* 5줄 */
};
const handlePasswordCheckValidation = (
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  /* 5줄 */
};
const handlePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
  /* 3줄 */
};
const handlePasswordCheckVisibility = (
  e: React.MouseEvent<HTMLButtonElement>,
) => {
  /* 3줄 */
};
const handleCompanyNameValidation = (
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  /* 3줄 */
};
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  /* 25줄 */
};
```

- 인라인 유효성 검사 hell

```tsx
{
  errorResponseMessage ? (
    <span className="text-sm text-red-600">{errorResponseMessage}</span>
  ) : !email ? (
    <span className="text-sm text-red-600">이메일을 입력해 주세요.</span>
  ) : email && emailError ? (
    <span className="text-sm text-red-600">올바른 이메일 형식이 아닙니다.</span>
  ) : email && !emailError ? (
    <span className="text-sm text-green-500">✓</span>
  ) : null;
}
```

> 현재 코드

- ✨ 1개의 useForm으로 모든 것 해결

```tsx
const {
  register,
  handleSubmit,
  watch,
  formState: { errors, isSubmitting, isSubmitted },
} = useForm<SignupFormSchemaType>({
  resolver: zodResolver(signUpFormSchema),
});
```

- ✨ 1개의 핸들러로 모든 것 해결

```tsx
const onSubmit = async (data: SignupFormSchemaType) => {
  try {
    await signUp({
      email: escapeForXSS(data.email),
      password: escapeForXSS(data.password),
      name: escapeForXSS(data.name),
      companyName: escapeForXSS(data.companyName),
    });
  } catch (error) {
    /* 에러 처리 */
  }
};
```

- zod로 만든 스키마를 활용하여 1줄로 깔끔히 정리

```tsx
resolver: zodResolver(signUpFormSchema);
```

> 정리

🔥 코드 감소

|  코드 라인  |   이전 방식   |  현재 방식   |    개선 효과     |
| :---------: | :-----------: | :----------: | :--------------: |
|   총 라인   |      172      |     120      |     30% 감소     |
|    상태     | useState 15개 | useForm 1개  |     93% 감소     |
| 핸들러 함수 | 'handle-' 8개 | onSubmit 1개 |     87% 감소     |
| 유효성 검사 |      60       | 외부 스키마  | 100% 감소 (분리) |

🔥 성능 개선

|   성능 지표   |        이전 방식         |      현재 방식      | 개선 효과 |
| :-----------: | :----------------------: | :-----------------: | :-------: |
| 리렌더링 횟수 |     타이핑 할 때마다     | useForm 내부 최적화 | 80% 감소  |
|  유효성 검사  | onChange가 감지할 때마다 |   필요한 시점에만   | 70% 감소  |
|   DOM 조작    |   상태가 변경될 때마다   |    최적화된 조작    | 60% 감소  |

### 2. SSR + CSR 하이브리드 필터링

## 🧐 프로덕트 엔지니어링

> ### 유저 피드백 반영

<img src="https://github.com/user-attachments/assets/1f7ec0f1-1268-4e2c-93dd-585581d0e2ca" width="800px" height='450px'/>

`코드잇 FE SI 9기` 중간 발표 이후 타 팀 스프린터들의 평가를 받게 되었습니다. <br>

평가 문항 3개, 각 문항당 1~5점

- 웹 사이트의 기능 및 사용성에 대해 어떻게 생각하셨나요? → 평균 약 4.148점
- 디자인이 얼마나 직관적이었나요? → 평균 약 4.370점
- 프로젝트의 전반적인 만족도는 어떠셨나요? → 평균 약 4.259점

총 평균 약 4.173점 <br>

전체 7개 팀 중 몇 위인지는 모릅니다만, 스프린터분들께서 주신 피드백은 매우 건설적이었습니다.
소중한 유저라고 생각하며 유저의 목소리를 적극 반영하고자 저희 팀은 바로 UI/UX 개선에 들어갔습니다.
이에 제한적인 API 제공으로 인한 기술적 한계를 제외하고는 거의 `90%`는 수용하여 개선을 하였습니다.

> ### 성능 최적화

<img src="https://github.com/user-attachments/assets/1e604cda-4a46-4c4c-98ef-f7bd6ad1f341" width="500px" height='130px'/>

`Lighthouse` 기준 거의 모든 페이지가 이미지에 의한 LCP 유발로 성능 저하가 발생하여,
평균적으로 **85점** 정도의 성능 점수가 나왔습니다.
(개선 후 캡쳐 업데이트 예정)

## 🎯 스프린트 회고

### 1. 기술적 성과

- **Feature Based Architecture** 도입으로 협업 과정에서의 DX 향상
- **Async Surf** 아키텍처를 통한 체계적인 비동기 통신 관리
- 이미지 최적화를 통한 성능 개선 (Lighthouse 기준 85점 → 94점)

### 2. 프로덕트 관점 개발

- 스프린터들의 피드백을 90% 이상 반영한 UI/UX 개선
- 사용성 평가에서 평균 4.17점이라는 높은 점수 달성
- 에러 처리와 사용자 피드백 시스템 구축

### 3. 배운 점과 아쉬운 점

> **배운 점**

- 시간 효율적 & 비용 효율적인 개발에 필요한 아키텍쳐의 중요성을 알 수 있었습니다.
- 사용자 피드백을 통한 실질적인 서비스 개선 경험이라는 값진 경험을 했습니다.
- 스크럼과 문서화 기반의 협업 관리 방식이 팀의 코드 일관성과 개발 속도에 기여함을 알 수 있었습니다.

> **아쉬운 점 & 향후 계획**

- 고정된 백엔드 API를 기반으로 진행하는 방식이라 한계로 인해 반영하지 못한 유저 피드백이 아쉽습니다.
- 지금 코드보다 더 좋은 코드 구조를 생각하지 못해서 아쉽습니다.

### 4. 총평

기술적 완성도뿐만 아니라, 실제 사용자의 니즈를 파악하고 반영하는 과정의 중요성을 배웠습니다.
앞으로도 더 나은 DX를 위한 방법론에 대해 고민하며 공부하고, 유저친화적 UX를 제공하는 서비스를 만들어 나갈 것입니다.

## 🙌 Thanks to

> **묵묵히 따라와준 팀원 상훈님**

> **기술적으로 조언을 해주신 멘토님**

> **배포 과정에서 솔루션을 주신 강사님**

---

**© 2025 Meet Meet All rights reserved**<br>
**Scripted By <a href='https://github.com/window-ook'>window-ook</a>**
