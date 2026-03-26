import type { ImageMetadata } from "astro";
import progateAndAwsHackathon1 from "../assets/progate_and_aws_hackathon_1.JPG";
import type { Lang } from "./i18n";

type LocalizedText = {
  ja: string;
  en: string;
};

export type Moment = {
  id: string;
  period: string;
  title: LocalizedText;
  description: LocalizedText;
  image?: ImageMetadata;
  imageAlt?: LocalizedText;
};

export const moments: Moment[] = [
  {
    id: "entered-hibiya-high-school",
    period: "2020.04",
    title: {
      ja: "日比谷高校に入学",
      en: "Entered Hibiya High School"
    },
    description: {
      ja: "",
      en: ""
    }
  },
  {
    id: "hibiya-festival",
    period: "2022.09",
    title: {
      ja: "文化祭で「アラジンと魔法のランプ」のジーニーを演じ、クラスは星稜大賞に選出",
      en: 'Played Genie in our school festival performance of "Aladdin and the Magic Lamp," and our class won the Seiryo Grand Prize'
    },
    description: {
      ja: "人に見せるためのものを作る面白さを、かなり具体的に実感した時期。",
      en: "This was a period when the joy of creating something for other people became much more concrete to me."
    }
  },
  {
    id: "started-university",
    period: "2024.04",
    title: {
      ja: "東洋大学 情報連携学部に入学",
      en: "Entered the Faculty of Information Networking for Innovation and Design at Toyo University"
    },
    description: {
      ja: "この時からITに触れ始め、プログラミングの存在を知った。",
      en: "This was when I first started touching IT and learned that programming existed as something I could pursue."
    }
  },
  {
    id: "started-serious-programming-study",
    period: "2025.03",
    title: {
      ja: "ここら辺からプログラミングの学習をちゃんと始める",
      en: "Around here, I started taking programming study seriously"
    },
    description: {
      ja: "",
      en: ""
    }
  },
  {
    id: "joined-atlas",
    period: "2025.06",
    title: {
      ja: "Atlasで実務に深く入る",
      en: "Stepped into real product work at Atlas"
    },
    description: {
      ja: "実装だけでなく、チームや意思決定、ビジネスサイドまで含めて責任を持つ感覚が出てきた。",
      en: "Responsibility started to extend beyond implementation to the team, decision-making, and the business side as well."
    }
  },
  {
    id: "progate-aws-hackathon-award",
    period: "2026.03",
    title: {
      ja: "Progate × AWS Hackathon 優秀賞",
      en: "Excellence Award at the Progate x AWS Hackathon"
    },
    description: {
      ja: "短い期間で形にして、評価まで届いたことがうれしかった出来事。",
      en: "A moment I was happy to see a short sprint turn into something recognized."
    },
    image: progateAndAwsHackathon1,
    imageAlt: {
      ja: "Progate × AWS Hackathon での様子",
      en: "Scene from the Progate x AWS Hackathon"
    }
  }
];

export function getMomentEntries(lang: Lang) {
  return moments.map((moment) => ({
    period: moment.period,
    title: moment.title[lang],
    description: moment.description[lang],
    image: moment.image,
    imageAlt: moment.imageAlt?.[lang]
  }));
}
