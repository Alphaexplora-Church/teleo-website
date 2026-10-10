export type IntakeQuestionFieldType = "textarea" | "text";

export interface DiscipleshipIntakeQuestion {
  id: string;
  label: string;
  placeholder: string;
  field_type: IntakeQuestionFieldType;
  required: boolean;
  min_length?: number;
  max_length: number;
}

export interface ChurchIntakeFormTemplate {
  church_id: number;
  questions: DiscipleshipIntakeQuestion[];
}

export const mockDiscipleshipIntakeQuestions: Record<
  number,
  ChurchIntakeFormTemplate
> = {
  // 101 - Grace Community Church (3 Questions - Katulad ng nasa mockup)
  101: {
    church_id: 101,
    questions: [
      {
        id: "q1",
        label: "Where are you in your walk with God?",
        placeholder: "Write your response here...",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
      {
        id: "q2",
        label: "What are you hoping to find in a group?",
        placeholder: "Write your response here...",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
      {
        id: "q3",
        label: "Preferred meeting time / schedule",
        placeholder: "Write your response here...",
        field_type: "text",
        required: true,
        max_length: 100,
      },
    ],
  },

  // 102 - Riverside Fellowship (2 Questions - Simpleng form)
  102: {
    church_id: 102,
    questions: [
      {
        id: "q1",
        label: "Where are you in your walk with God?",
        placeholder: "Write your response here...",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
      {
        id: "q2",
        label: "What are you hoping to find in a group?",
        placeholder: "Write your response here...",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
      {
        id: "q3",
        label: "Preferred meeting time / schedule",
        placeholder: "Write your response here...",
        field_type: "text",
        required: true,
        max_length: 100,
      },
    ],
  },

  // 105 - Victory Christian Fellowship (4 Questions)
  105: {
    church_id: 105,
    questions: [
      {
        id: "q1",
        label: "How long have you been attending Victory?",
        placeholder: "Write your response here...",
        field_type: "text",
        required: true,
        max_length: 100,
      },
      {
        id: "q2",
        label: "Have you completed the ONE 2 ONE foundations booklet?",
        placeholder: "Write your response here...",
        field_type: "text",
        required: true,
        max_length: 100,
      },
      {
        id: "q3",
        label: "What are your primary goals for joining a Victory group?",
        placeholder: "Write your response here...",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
      {
        id: "q4",
        label: "Preferred meeting setup",
        placeholder: "Write your response here...",
        field_type: "text",
        required: true,
        max_length: 100,
      },
    ],
  },

  // 106 - Christ Commission Fellowship (Max 5 Questions)
  106: {
    church_id: 106,
    questions: [
      {
        id: "q1",
        label:
          "Where are you currently in your personal walk with Jesus Christ?",
        placeholder: "Write your response here...",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
      {
        id: "q2",
        label:
          "Have you received Jesus Christ as your personal Lord and Savior?",
        placeholder: "Write your response here...",
        field_type: "text",
        required: true,
        max_length: 100,
      },
      {
        id: "q3",
        label: "What life stage group fits you best?",
        placeholder: "Write your response here...",
        field_type: "text",
        required: true,
        max_length: 100,
      },
      {
        id: "q4",
        label: "What areas in life do you want prayer and accountability for?",
        placeholder: "Write your response here...",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
      {
        id: "q5",
        label: "Preferred day and time for weekly D-Group",
        placeholder: "Write your response here...",
        field_type: "text",
        required: true,
        max_length: 100,
      },
    ],
  },

  // 107 - Faith Community Bible Church (2 Questions)
  107: {
    church_id: 107,
    questions: [
      {
        id: "q1",
        label: "How did you hear about Faith Community Bible Church?",
        placeholder: "Write your response here...",
        field_type: "text",
        required: true,
        max_length: 100,
      },
      {
        id: "q2",
        label: "What are you hoping to learn or study together?",
        placeholder: "Write your response here...",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
    ],
  },

  // 108 - Metro South Bible Fellowship (3 Questions)
  108: {
    church_id: 108,
    questions: [
      {
        id: "q1",
        label: "Briefly share how you came to know Christ.",
        placeholder: "Write your response here...",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
      {
        id: "q2",
        label: "Are you currently involved in any other church or small group?",
        placeholder: "Write your response here...",
        field_type: "text",
        required: true,
        max_length: 100,
      },
      {
        id: "q3",
        label: "What area of Parañaque are you located in?",
        placeholder: "Write your response here...",
        field_type: "text",
        required: true,
        max_length: 100,
      },
    ],
  },

  // 109 - Cornerstone Christian Church (1 Question - Pinakamaikli)
  109: {
    church_id: 109,
    questions: [
      {
        id: "q1",
        label:
          "Tell us about yourself and what you are looking for in an online group.",
        placeholder: "Write your response here...",
        field_type: "textarea",
        required: true,
        max_length: 500,
      },
    ],
  },
};

/**
 * Kinukuha ang intake form template batay sa church_id na pinili.
 */
export function getIntakeQuestionsByChurchId(
  churchId: number,
): ChurchIntakeFormTemplate {
  return (
    mockDiscipleshipIntakeQuestions[churchId] ||
    mockDiscipleshipIntakeQuestions[101]
  );
}
