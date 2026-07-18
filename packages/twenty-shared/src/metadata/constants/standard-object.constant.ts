import { buildStandardObjectSystemFields } from '@/metadata/utils/internal/build-standard-object-system-fields.util';

// Important notice:
// - Never ever mutate an existing universal identifier
// - Deleting an existing universal identifier should be very rare
// - System field universal identifiers (id, createdAt, updatedAt,
//   deletedAt, createdBy, updatedBy, position, searchVector) are
//   deterministically derived from the standard application universal
//   identifier, the object universal identifier and the field name.
//   The name field is a default field, not a system field, and keeps its
//   hardcoded universal identifier.
export const STANDARD_OBJECTS = {
  attachment: {
    universalIdentifier: '20202020-bd3d-4c60-8dca-571c71d4447a',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-bd3d-4c60-8dca-571c71d4447a',
      ),
      name: { universalIdentifier: '20202020-87a5-48f8-bbf7-ade388825a57' },
      file: { universalIdentifier: '20202020-15db-460e-8166-c7b5d87ad4be' },
      //deprecated
      fullPath: { universalIdentifier: '20202020-0d19-453d-8e8d-fbcda8ca3747' },
      //deprecated
      fileCategory: {
        universalIdentifier: '20202020-8c3f-4d9e-9a1b-2e5f7a8c9d0e',
      },
      targetTask: {
        universalIdentifier: '20202020-51e5-4621-9cf8-215487951c4b',
      },
      targetNote: {
        universalIdentifier: '20202020-4f4b-4503-a6fc-6b982f3dffb5',
      },
      targetPerson: {
        universalIdentifier: '20202020-0158-4aa2-965c-5cdafe21ffa2',
      },
      targetCompany: {
        universalIdentifier: '20202020-ceab-4a28-b546-73b06b4c08d5',
      },
      targetOpportunity: {
        universalIdentifier: '20202020-7374-499d-bea3-9354890755b5',
      },
      targetDashboard: {
        universalIdentifier: '20202020-5324-43f3-9dbf-1a33e7de0ce6',
      },
      targetWorkflow: {
        universalIdentifier: '20202020-f1e8-4c9d-8a7b-3f5e1d2c9a8b',
      },
      targetSearchEngagementTerms: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8bc1',
      },
      targetClientAccountProfile: {
        universalIdentifier: '20202020-a1b2-4c3d-8e5f-6a7b8c9d0e01',
      },
    },
    morphIds: {
      targetMorphId: { morphId: '20202020-f634-435d-ab8d-e1168b375c69' },
    },
    indexes: {
      taskIdIndex: {
        universalIdentifier: 'b8d4f9a3-0c25-4e7b-9f6a-2d3e4c5b6f70',
      },
      noteIdIndex: {
        universalIdentifier: '9d31ea73-13b6-4e06-84ee-c66c72bf7787',
      },
      personIdIndex: {
        universalIdentifier: '55637a5a-1edc-4351-8d76-d40020bf8944',
      },
      companyIdIndex: {
        universalIdentifier: '4137ba06-184d-438f-b484-080f02a97659',
      },
      opportunityIdIndex: {
        universalIdentifier: '8cc162d1-c127-4981-878d-f78622f8f12d',
      },
      dashboardIdIndex: {
        universalIdentifier: 'c10eba2d-ff1a-4eab-9285-50481c12a003',
      },
      workflowIdIndex: {
        universalIdentifier: 'fadeab4b-79ee-4173-af79-72c51fbad888',
      },
    },
    views: {
      allAttachments: {
        universalIdentifier: '3f7f3363-7087-44cc-902d-5e8904262316',
        viewFields: {
          name: {
            universalIdentifier: 'be56712f-d7a6-4fbe-b92b-d750f0708a0a',
          },
          file: {
            universalIdentifier: '873cf114-5477-4b62-9023-7ea6ad69fbe5',
          },
          createdBy: {
            universalIdentifier: 'fa363372-0fdf-4bb3-bdf1-0ead354b9225',
          },
          createdAt: {
            universalIdentifier: '6c092c26-b1cb-488f-ae2e-5af4bec1162b',
          },
          targetPerson: {
            universalIdentifier: '73a4c3a7-c7f9-4ed6-a2b6-117d7efad0f3',
          },
          targetCompany: {
            universalIdentifier: 'b335ad04-059e-4c36-8666-f40431849044',
          },
          targetOpportunity: {
            universalIdentifier: '15f2d457-dc09-4c52-bf2a-47083d6bf017',
          },
          targetTask: {
            universalIdentifier: 'c2913c5e-6cc6-438d-9c2f-3212a9b2a82b',
          },
          targetNote: {
            universalIdentifier: 'fc8dba49-bcf2-41b8-a435-0c4a3bbf2af6',
          },
          targetDashboard: {
            universalIdentifier: 'bcc6d6e1-7c0b-4291-9270-66e42024d8dd',
          },
          targetWorkflow: {
            universalIdentifier: '11fcf58b-dbab-42dd-be67-689462111070',
          },
        },
      },
    },
  },
  blocklist: {
    universalIdentifier: '20202020-0408-4f38-b8a8-4d5e3e26e24d',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-0408-4f38-b8a8-4d5e3e26e24d',
      ),
      handle: { universalIdentifier: '20202020-eef3-44ed-aa32-4641d7fd4a3e' },
      workspaceMember: {
        universalIdentifier: '20202020-548d-4084-a947-fa20a39f7c06',
      },
    },
    indexes: {
      workspaceMemberIdIndex: {
        universalIdentifier: '4daf320e-74d0-4f24-a45a-af3a09d741cb',
      },
    },
    views: {
      allBlocklists: {
        universalIdentifier: '5a98e88c-67c2-4f61-a5ab-a0d3d6a836bb',
        viewFields: {
          handle: {
            universalIdentifier: '155ae00d-0def-4f62-9473-8a8efa209eee',
          },
          workspaceMember: {
            universalIdentifier: '05a2f0b9-f2ef-4729-bc42-9e2ad2a34fb2',
          },
          createdAt: {
            universalIdentifier: 'e7cfcf05-2676-4d43-9eee-4da1016b12ff',
          },
        },
      },
      blocklistRecordPageFields: {
        universalIdentifier: '5c679d04-7a1c-41be-9429-c9317ac7a0ea',
        viewFieldGroups: {
          general: {
            universalIdentifier: '94009e34-52fb-4534-89ce-6c6d0a774056',
          },
          system: {
            universalIdentifier: '35dace44-6e63-4cdb-b761-a92bcf126a7e',
          },
        },
        viewFields: {
          workspaceMember: {
            universalIdentifier: 'f2f5732f-7435-44be-986b-4c4d834fdfeb',
          },
          createdAt: {
            universalIdentifier: 'b2594a03-e00f-4de9-89da-b34bb95c2221',
          },
          createdBy: {
            universalIdentifier: '80a60507-6c7a-4713-b5de-b94ac293bf23',
          },
        },
      },
    },
  },
  calendarChannelEventAssociation: {
    universalIdentifier: '20202020-491b-4aaa-9825-afd1bae6ae00',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-491b-4aaa-9825-afd1bae6ae00',
      ),
      calendarChannelId: {
        universalIdentifier: '20202020-93ee-4da4-8d58-0282c4a9cb7d',
      },
      calendarEvent: {
        universalIdentifier: '20202020-5aa5-437e-bb86-f42d457783e3',
      },
      eventExternalId: {
        universalIdentifier: '20202020-9ec8-48bb-b279-21d0734a75a1',
      },
      recurringEventExternalId: {
        universalIdentifier: '20202020-c58f-4c69-9bf8-9518fa31aa50',
      },
    },
    indexes: {
      calendarChannelIdIndex: {
        universalIdentifier: 'ff6b86c1-3112-4dfa-b734-c4789111a716',
      },
      calendarEventIdIndex: {
        universalIdentifier: '47a3c8d2-9f14-4b6e-8c5d-1a2b3f4e5c69',
      },
    },
    views: {
      allCalendarChannelEventAssociations: {
        universalIdentifier: '001893be-c06c-4ba1-9f18-53bd26f0179f',
        viewFields: {
          calendarChannelId: {
            universalIdentifier: 'e3adffd2-d820-4c89-912c-34908d90057e',
          },
          calendarEvent: {
            universalIdentifier: '35656a84-ecb8-4075-a610-8b538d6f8120',
          },
          eventExternalId: {
            universalIdentifier: 'f779d7e8-f1d8-44a7-b0ef-4409c9b6b466',
          },
          createdAt: {
            universalIdentifier: '8ca74f2f-210b-4afc-81f0-506047400e82',
          },
        },
      },
      calendarChannelEventAssociationRecordPageFields: {
        universalIdentifier: '766f254a-a0eb-45c8-b4d2-12311201e08f',
        viewFieldGroups: {
          general: {
            universalIdentifier: '9c27f771-9f85-492f-b1f1-9bc7a175f6f3',
          },
          system: {
            universalIdentifier: 'c7b18e05-dd60-4ee4-911a-290790e8c425',
          },
        },
        viewFields: {
          calendarChannelId: {
            universalIdentifier: 'cd6c6714-fc1d-4511-a664-ec5e8dfd8692',
          },
          calendarEvent: {
            universalIdentifier: '4790ca84-255e-4cb7-9b20-c17f4d94df8e',
          },
          eventExternalId: {
            universalIdentifier: 'dbe16c1b-ece2-4d2f-b634-094742ac3e16',
          },
          createdAt: {
            universalIdentifier: '2702ae80-9108-4757-8a25-317a4357484e',
          },
          createdBy: {
            universalIdentifier: '201e0c45-fddc-4217-bfd4-40c13d7f7916',
          },
        },
      },
    },
  },
  calendarEventParticipant: {
    universalIdentifier: '20202020-a1c3-47a6-9732-27e5b1e8436d',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-a1c3-47a6-9732-27e5b1e8436d',
      ),
      calendarEvent: {
        universalIdentifier: '20202020-fe3a-401c-b889-af4f4657a861',
      },
      handle: {
        universalIdentifier: '20202020-8692-4580-8210-9e09cbd031a7',
      },
      displayName: {
        universalIdentifier: '20202020-ee1e-4f9f-8ac1-5c0b2f69691e',
      },
      isOrganizer: {
        universalIdentifier: '20202020-66e7-4e00-9e06-d06c92650580',
      },
      responseStatus: {
        universalIdentifier: '20202020-cec0-4be8-8fba-c366abc23147',
      },
      person: {
        universalIdentifier: '20202020-5761-4842-8186-e1898ef93966',
      },
      workspaceMember: {
        universalIdentifier: '20202020-20e4-4591-93ed-aeb17a4dcbd2',
      },
    },
    indexes: {
      calendarEventIdIndex: {
        universalIdentifier: 'c458ad97-8b95-43de-9003-88eb68576049',
      },
      personIdIndex: {
        universalIdentifier: '30e9b75a-881f-4a85-aaf1-f2d2464be1cf',
      },
      workspaceMemberIdIndex: {
        universalIdentifier: '898aa202-428f-4a7a-a3b3-8f0a17a6658e',
      },
    },
    views: {
      allCalendarEventParticipants: {
        universalIdentifier: '5228d634-6b69-4a43-be5c-e778fa6fe779',
        viewFields: {
          calendarEvent: {
            universalIdentifier: 'd9c2f346-b83b-48ae-98d0-e344f97248cd',
          },
          handle: {
            universalIdentifier: '4140bd68-55e8-475c-8724-7f9f97634a9f',
          },
          displayName: {
            universalIdentifier: '3cadc470-9231-4027-9bbe-60e934edb483',
          },
          isOrganizer: {
            universalIdentifier: '684972f9-c5fe-4fff-bdec-2fc5511c938c',
          },
          responseStatus: {
            universalIdentifier: 'dd0ab0bd-7f33-48fa-9461-fb5d085a2f9f',
          },
          person: {
            universalIdentifier: '86546244-9e3d-40e4-87cd-cbc82a353d2e',
          },
          workspaceMember: {
            universalIdentifier: '542141b0-ac85-4c43-867b-8d7f559b07ae',
          },
          createdAt: {
            universalIdentifier: '63d9d40d-e40c-410c-a14c-2f36c64c3e69',
          },
        },
      },
      calendarEventParticipantRecordPageFields: {
        universalIdentifier: 'e01ebdb3-8fb8-46d2-8230-82242d593f7a',
        viewFieldGroups: {
          general: {
            universalIdentifier: '3d842777-436e-467d-90ae-9e1fa0aa7e9c',
          },
          system: {
            universalIdentifier: '098836d8-15c1-44c1-a58e-2ff7fd6a05f9',
          },
        },
        viewFields: {
          calendarEvent: {
            universalIdentifier: '865a1278-c356-4b99-a5e9-1ca3d33c7665',
          },
          handle: {
            universalIdentifier: 'eb09af9c-b3f4-403c-8cb2-172243f83958',
          },
          displayName: {
            universalIdentifier: '23b97527-6ad3-4f07-bf68-559b97321673',
          },
          isOrganizer: {
            universalIdentifier: '3c126f3c-bd01-4029-b58a-724513fa5fff',
          },
          responseStatus: {
            universalIdentifier: 'cd02fc91-8fa4-4fa3-b0e3-1a1fc891e6ee',
          },
          person: {
            universalIdentifier: '46be729d-091c-4012-aeca-16a743008513',
          },
          workspaceMember: {
            universalIdentifier: 'c38c1111-f6e0-4698-9b36-db59f8d97de3',
          },
          createdAt: {
            universalIdentifier: '1447c7fa-fe2b-4ff7-8036-8de682537e23',
          },
          createdBy: {
            universalIdentifier: '6d7dff75-0230-45bd-8db9-dc25ef007e6e',
          },
        },
      },
    },
  },
  calendarEvent: {
    universalIdentifier: '20202020-8f1d-4eef-9f85-0d1965e27221',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-8f1d-4eef-9f85-0d1965e27221',
      ),
      title: { universalIdentifier: '20202020-080e-49d1-b21d-9702a7e2525c' },
      isCanceled: {
        universalIdentifier: '20202020-335b-4e04-b470-43b84b64863c',
      },
      isFullDay: {
        universalIdentifier: '20202020-551c-402c-bb6d-dfe9efe86bcb',
      },
      startsAt: {
        universalIdentifier: '20202020-2c57-4c75-93c5-2ac950a6ed67',
      },
      endsAt: { universalIdentifier: '20202020-2554-4ee1-a617-17907f6bab21' },
      externalCreatedAt: {
        universalIdentifier: '20202020-9f03-4058-a898-346c62181599',
      },
      externalUpdatedAt: {
        universalIdentifier: '20202020-b355-4c18-8825-ef42c8a5a755',
      },
      description: {
        universalIdentifier: '20202020-52c4-4266-a98f-e90af0b4d271',
      },
      location: {
        universalIdentifier: '20202020-641a-4ffe-960d-c3c186d95b17',
      },
      iCalUid: {
        universalIdentifier: '20202020-f24b-45f4-b6a3-d2f9fcb98714',
      },
      conferenceSolution: {
        universalIdentifier: '20202020-1c3f-4b5a-b526-5411a82179eb',
      },
      conferenceLink: {
        universalIdentifier: '20202020-35da-43ef-9ca0-e936e9dc237b',
      },
      calendarChannelEventAssociations: {
        universalIdentifier: '20202020-bdf8-4572-a2cc-ecbb6bcc3a02',
      },
      calendarEventParticipants: {
        universalIdentifier: '20202020-e07e-4ccb-88f5-6f3d00458eec',
      },
      callRecordings: {
        universalIdentifier: '48d6d151-18e2-4111-b405-d85fb9d860d8',
      },
    },
    indexes: {},
    views: {
      allCalendarEvents: {
        universalIdentifier: '20202020-c001-4c01-8c01-ca1ebe0ca001',
        viewFields: {
          title: {
            universalIdentifier: '20202020-cf01-4c01-8c01-ca1ebe0caf01',
          },
          startsAt: {
            universalIdentifier: '20202020-cf01-4c01-8c01-ca1ebe0caf02',
          },
          endsAt: {
            universalIdentifier: '20202020-cf01-4c01-8c01-ca1ebe0caf03',
          },
          isFullDay: {
            universalIdentifier: '20202020-cf01-4c01-8c01-ca1ebe0caf04',
          },
          location: {
            universalIdentifier: '20202020-cf01-4c01-8c01-ca1ebe0caf05',
          },
          conferenceLink: {
            universalIdentifier: '20202020-cf01-4c01-8c01-ca1ebe0caf06',
          },
          isCanceled: {
            universalIdentifier: '20202020-cf01-4c01-8c01-ca1ebe0caf07',
          },
          createdAt: {
            universalIdentifier: '20202020-cf01-4c01-8c01-ca1ebe0caf08',
          },
        },
      },
      calendarEventRecordPageFields: {
        universalIdentifier: 'c73668d1-022d-4eaf-b825-4e2548180db6',
        viewFieldGroups: {
          general: {
            universalIdentifier: 'aeadeb9e-3673-4c0c-8845-f59cb1e6ca42',
          },
          system: {
            universalIdentifier: 'eb1aadeb-7feb-44d1-9f9a-e9929e8690fc',
          },
        },
        viewFields: {
          title: {
            universalIdentifier: 'd17fc76f-2c3a-4c84-8249-27227bf71638',
          },
          startsAt: {
            universalIdentifier: '7bbd3744-d870-4704-882c-071732ed23d9',
          },
          endsAt: {
            universalIdentifier: 'ed7ca7e9-c8b3-4516-be4c-6491a27af847',
          },
          isFullDay: {
            universalIdentifier: '5d8f89b7-ec9e-41d6-9efe-96f9c32e6c20',
          },
          isCanceled: {
            universalIdentifier: 'a01f490d-cf67-4458-801e-13d81e74b45a',
          },
          conferenceLink: {
            universalIdentifier: '5ad748ae-e1bb-47bb-ac34-d82663c31b6e',
          },
          location: {
            universalIdentifier: '66c73e74-56e6-40c3-b776-0081ee757b8a',
          },
          description: {
            universalIdentifier: 'a09449be-b23f-48d4-b0dc-0bd36813220a',
          },
          externalCreatedAt: {
            universalIdentifier: '689c3eba-bedf-4a52-b9f1-3e34ce718251',
          },
          externalUpdatedAt: {
            universalIdentifier: '7823fa45-8cba-47ba-8dfb-5841bef44fc6',
          },
          iCalUid: {
            universalIdentifier: '8be763dd-6217-47fb-a7d2-ac223af881d2',
          },
          conferenceSolution: {
            universalIdentifier: '795905b6-c6f8-42cf-b8ea-3e5b6d32145f',
          },
        },
      },
    },
  },
  callRecording: {
    universalIdentifier: 'ce19efb9-710f-45b2-b141-473abbeea60b',
    fields: {
      ...buildStandardObjectSystemFields(
        'ce19efb9-710f-45b2-b141-473abbeea60b',
      ),
      title: {
        universalIdentifier: '4cff8863-a1d1-45fd-a370-4eb6aa1f2a5b',
      },
      status: {
        universalIdentifier: '3e617680-d93e-4309-a54f-90f69528bfd7',
      },
      recordingRequestStatus: {
        universalIdentifier: '7fd681c9-244c-4e98-8939-7b175d472638',
      },
      applicationId: {
        universalIdentifier: '24ec1239-1240-42cb-8a2d-302632378e09',
      },
      externalBotId: {
        universalIdentifier: '0a2da128-9bcc-488b-bc31-65318c41bdf9',
      },
      externalRecordingId: {
        universalIdentifier: '6d17fb71-324b-4625-a5be-b3580607e2c7',
      },
      startedAt: {
        universalIdentifier: '6c56c23f-1987-410a-860a-df3b2b3f9a33',
      },
      endedAt: {
        universalIdentifier: '7a38a9cf-8424-4d6e-b80a-6883d3c662ef',
      },
      video: {
        universalIdentifier: 'bb9523d3-457e-4f4b-8c79-27a77afb87da',
      },
      audio: {
        universalIdentifier: '2eafc2d0-8fec-430c-a939-65ca5fbc0f08',
      },
      transcript: {
        universalIdentifier: '27b86d68-57d1-4607-aca0-191896b1ad43',
      },
      summary: {
        universalIdentifier: 'adb0f472-756b-4d3f-b21e-ea32bf73a5e4',
      },
      calendarEvent: {
        universalIdentifier: '49e64b28-bd98-4775-80ea-4781bdd45e35',
      },
    },
    indexes: {
      calendarEventIdIndex: {
        universalIdentifier: '8be3cc47-9352-4a1b-ad19-bb186bc0865d',
      },
    },
    views: {
      allCallRecordings: {
        universalIdentifier: 'c395b55e-88f0-4d5b-a1fb-0d38b50e0b19',
        viewFields: {
          status: {
            universalIdentifier: '6c4a81a2-d9c1-4f82-984c-f97e083ca710',
          },
          recordingRequestStatus: {
            universalIdentifier: '3bdedacd-0fd5-4175-8d28-2fe41bb5aa77',
          },
          title: {
            universalIdentifier: 'b1d5051b-071d-4514-93cf-704724cdc8f6',
          },
          startedAt: {
            universalIdentifier: '3b96351f-66ed-4fa6-acb6-698647573af7',
          },
        },
      },
      callRecordingRecordPageFields: {
        universalIdentifier: '99fa8b47-3b11-4f9b-8fbc-e67a9e1da682',
        viewFieldGroups: {
          general: {
            universalIdentifier: '068426eb-dd20-49b0-ae9c-68727f3be2fb',
          },
        },
        viewFields: {
          title: {
            universalIdentifier: '6308d574-8579-4cf2-a020-c208df97cf3e',
          },
          status: {
            universalIdentifier: '93483569-fcd2-46cf-b576-9f0318ad2b3b',
          },
          recordingRequestStatus: {
            universalIdentifier: '364a90b1-e9aa-4606-996b-46e579ebeb28',
          },
          startedAt: {
            universalIdentifier: '3fd00fbb-c153-45e3-b6e6-43d18d34052a',
          },
          endedAt: {
            universalIdentifier: 'ba8c8d41-c112-4173-b927-5b5c5a5c047b',
          },
          video: {
            universalIdentifier: 'acc54ade-cd26-4be2-9391-a42715ad1523',
          },
          audio: {
            universalIdentifier: '9445a547-1d1e-4da3-916b-2c2269c951c9',
          },
          transcript: {
            universalIdentifier: '782c97f6-e6b1-472b-8992-bbb60d25791b',
          },
          summary: {
            universalIdentifier: 'a0ace064-cc72-4631-ade3-07cdded86b0e',
          },
        },
      },
    },
  },
  company: {
    universalIdentifier: '20202020-b374-4779-a561-80086cb2e17f',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-b374-4779-a561-80086cb2e17f',
      ),
      name: { universalIdentifier: '20202020-4d99-4e2e-a84c-4a27837b1ece' },
      domainName: {
        universalIdentifier: '20202020-0c28-43d8-8ba5-3659924d3489',
      },
      address: { universalIdentifier: '20202020-c5ce-4adc-b7b6-9c0979fc55e7' },
      linkedinLink: {
        universalIdentifier: '20202020-ebeb-4beb-b9ad-6848036fb451',
      },
      annualRevenue: {
        universalIdentifier: '60f533b7-2166-4071-a767-ceb0286822fd',
      },
      people: { universalIdentifier: '20202020-3213-4ddf-9494-6422bcff8d7c' },
      accountOwner: {
        universalIdentifier: '20202020-95b8-4e10-9881-edb5d4765f9d',
      },
      taskTargets: {
        universalIdentifier: '20202020-cb17-4a61-8f8f-3be6730480de',
      },
      noteTargets: {
        universalIdentifier: '20202020-bae0-4556-a74a-a9c686f77a88',
      },
      opportunities: {
        universalIdentifier: '20202020-add3-4658-8e23-d70dccb6d0ec',
      },
      attachments: {
        universalIdentifier: '20202020-c1b5-4120-b0f0-987ca401ed53',
      },
      timelineActivities: {
        universalIdentifier: '20202020-0414-4daf-9c0d-64fe7b27f89f',
      },
      clientStakeholderRoles: {
        universalIdentifier: '20202020-28b6-41b5-9a7d-102db20ed51b',
      },
      clientAccountProfiles: {
        universalIdentifier: '20202020-a1b2-4c3d-8e5f-6a7b8c9d0f01',
      },
      searchAssignments: {
        universalIdentifier: '3a87d9fc-4da9-4284-afd4-8f0719330b58',
      },
      offLimitsRestrictions: {
        universalIdentifier: '20202020-b2c3-4d5e-9f0a-7b8c9d0e1f2a',
      },
      clientOffLimitsRestrictions: {
        universalIdentifier: '20202020-c3d4-4e5f-0a1b-8c9d0e1f2a3b',
      },
      confidentialityRecords: {
        universalIdentifier: '20202020-d4e5-4f60-1b2c-9d0e1f2a3b4c',
      },
      conflictCheckSubjectCompanies: {
        universalIdentifier: '20202020-e5f6-4071-2c3d-0e1f2a3b4c5d',
      },
      sourceOfRelationshipEdges: {
        universalIdentifier: '20202020-f6a7-4182-3d4e-1f2a3b4c5d6e',
      },
      targetOfRelationshipEdges: {
        universalIdentifier: '20202020-a7b8-4293-4e5f-2a3b4c5d6e7f',
      },
    },
    indexes: {
      accountOwnerIdIndex: {
        universalIdentifier: 'ec2ebfc9-0c9b-4597-a87d-aa295e2d8bfe',
      },
      domainNameUniqueIndex: {
        universalIdentifier: 'dd300c61-f422-467a-91f4-de4f83c4175b',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'c3eb62df-2cc1-4cc3-b7aa-e96a4d65c633',
      },
    },
    views: {
      allCompanies: {
        universalIdentifier: '20202020-a001-4a01-8a01-c0aba11c0001',
        viewFields: {
          name: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11cf001',
          },
          domainName: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11cf002',
          },
          createdBy: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11cf003',
          },
          accountOwner: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11cf004',
          },
          createdAt: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11cf005',
          },
          linkedinLink: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11cf007',
          },
          address: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11cf008',
          },
        },
      },
      companyRecordPageFields: {
        universalIdentifier: '20202020-a001-4a01-8a01-c0aba11c1001',
        viewFieldGroups: {
          general: {
            universalIdentifier: '20202020-a001-4a01-8a01-c0aba11c1101',
          },
          business: {
            universalIdentifier: '20202020-a001-4a01-8a01-c0aba11c1102',
          },
          contact: {
            universalIdentifier: '20202020-a001-4a01-8a01-c0aba11c1103',
          },
          system: {
            universalIdentifier: '20202020-a001-4a01-8a01-c0aba11c1104',
          },
        },
        viewFields: {
          domainName: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1201',
          },
          accountOwner: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1202',
          },
          annualRevenue: {
            universalIdentifier: '2a35f734-dea2-4de9-8395-acbce8df0f97',
          },
          linkedinLink: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1206',
          },
          address: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1208',
          },
          createdAt: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1209',
          },
          createdBy: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1210',
          },
          updatedAt: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1212',
          },
          updatedBy: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1213',
          },
          people: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1214',
          },
          taskTargets: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1215',
          },
          noteTargets: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1216',
          },
          opportunities: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1217',
          },
          attachments: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c1219',
          },
          timelineActivities: {
            universalIdentifier: '20202020-af01-4a01-8a01-c0aba11c121a',
          },
        },
      },
    },
  },
  dashboard: {
    universalIdentifier: '20202020-3840-4b6d-9425-0c5188b05ca8',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-3840-4b6d-9425-0c5188b05ca8',
      ),
      title: { universalIdentifier: '20202020-20ee-4091-95dc-44b57eda3a89' },
      pageLayoutId: {
        universalIdentifier: '20202020-bb53-4648-aa36-1d9d54e6f7f2',
      },
      timelineActivities: {
        universalIdentifier: '99c330c0-5b7d-4276-a764-aed84499dfb5',
      },
      attachments: {
        universalIdentifier: '20202020-bf6f-4220-8c55-2764f1175870',
      },
    },
    indexes: {
      searchVectorGinIndex: {
        universalIdentifier: 'e69f71aa-de0f-4b70-845f-7a8369c47928',
      },
    },
    views: {
      allDashboards: {
        universalIdentifier: '20202020-a012-4a12-8a12-da5ab0b0a001',
        viewFields: {
          title: {
            universalIdentifier: '20202020-af12-4a12-8a12-da5ab0b0af01',
          },
          createdBy: {
            universalIdentifier: '20202020-af12-4a12-8a12-da5ab0b0af02',
          },
          createdAt: {
            universalIdentifier: '20202020-af12-4a12-8a12-da5ab0b0af03',
          },
          updatedAt: {
            universalIdentifier: '20202020-af12-4a12-8a12-da5ab0b0af04',
          },
        },
      },
    },
  },
  messageCampaign: {
    universalIdentifier: '238acb94-dd4c-4036-bc55-19b99d821efd',
    fields: {
      ...buildStandardObjectSystemFields(
        '238acb94-dd4c-4036-bc55-19b99d821efd',
      ),
      subject: { universalIdentifier: '7251544c-b07a-4f0d-9d0a-48514367f230' },
      bodyTemplate: {
        universalIdentifier: 'b3a69d08-31ca-4a8d-8359-5ca462899342',
      },
      fromAddress: {
        universalIdentifier: '91e1a33c-c1ff-411a-b720-9085e13c05db',
      },
      status: { universalIdentifier: 'c7117256-3de6-48e1-87df-c99c32bad610' },
      sentAt: { universalIdentifier: 'e2315b4f-9edf-4df2-96b9-961e76368671' },
      sentCount: {
        universalIdentifier: '2f333d2b-37b8-4ddc-ad0d-c07c6ce066ad',
      },
      failedCount: {
        universalIdentifier: 'd373fcd7-b1ce-4c77-8031-a5785c475028',
      },
      bouncedCount: {
        universalIdentifier: '20d884a9-34dd-4667-8ecb-ceec224258e2',
      },
      complainedCount: {
        universalIdentifier: '82842cfa-f12a-4bab-bbde-b2cf587d0406',
      },
      unsubscribeTopicId: {
        universalIdentifier: '0648e7ad-1769-4ff6-a4d5-72da79ef169c',
      },
      list: { universalIdentifier: 'cb24dcdf-f0e8-4c71-8cff-70b714e86530' },
      timelineActivities: {
        universalIdentifier: 'd4e5f607-1829-4da3-8eb4-25f607182930',
      },
      messages: { universalIdentifier: 'e5a177a7-512b-4778-928e-69777a528f7c' },
      recipients: {
        universalIdentifier: '05a3271c-5b91-493c-8f30-2d27b31d019e',
      },
    },
    indexes: {
      unsubscribeTopicIdIndex: {
        universalIdentifier: 'efe8c20e-d12b-4475-969e-e86e0bbfe444',
      },
      listIdIndex: {
        universalIdentifier: '17bffd6a-714a-458d-a547-f9e2183d9520',
      },
      searchVectorGinIndex: {
        universalIdentifier: '975823ad-9b97-4f39-b2c7-fbd7d77f4bd1',
      },
    },
    views: {
      allMessageCampaigns: {
        universalIdentifier: 'ffedb368-33f0-43a7-b84e-e622b4e97be9',
        viewFields: {
          subject: {
            universalIdentifier: 'b017c851-e38d-4a81-ab38-0fb10e9f239e',
          },
          status: {
            universalIdentifier: 'ef35df97-b1a5-4f16-8b85-5751e5019f63',
          },
          list: {
            universalIdentifier: 'c0bf6a48-8695-4520-81e6-7462d35033b5',
          },
          fromAddress: {
            universalIdentifier: '553a0ea6-1f55-4143-a2d0-8c1ad0cf3dd1',
          },
          sentAt: {
            universalIdentifier: '7f4a9d81-afac-4d27-98de-0a2da65114f7',
          },
          sentCount: {
            universalIdentifier: '0be62e57-3955-49bd-a9ef-8f82f7a6e9aa',
          },
          failedCount: {
            universalIdentifier: 'ad346c8e-f462-499e-89c8-da01d5460dc6',
          },
          bouncedCount: {
            universalIdentifier: '135d3fb9-bc45-4426-980b-9836ed792e3a',
          },
          complainedCount: {
            universalIdentifier: '9957dc6d-05ae-4829-ae7d-7cdf9239cdd0',
          },
          recipients: {
            universalIdentifier: '2f99f444-4af3-44fd-b08d-46955c4ac2a2',
          },
          createdAt: {
            universalIdentifier: '6dffa47d-3128-4d54-924a-4f67676116c2',
          },
        },
      },
    },
  },
  messageList: {
    universalIdentifier: '826561ea-4816-411c-baa0-eec5e6ca8866',
    fields: {
      ...buildStandardObjectSystemFields(
        '826561ea-4816-411c-baa0-eec5e6ca8866',
      ),
      name: { universalIdentifier: '69b9ed8b-7b26-4108-894f-05700ef7e8ee' },
      members: {
        universalIdentifier: '92df3493-91cf-4665-8587-1b08917d299b',
      },
      campaigns: {
        universalIdentifier: 'e098d838-31ab-4812-91a8-f055f45a6832',
      },
      timelineActivities: {
        universalIdentifier: 'e0a5b2c3-4d6f-4e81-9a02-1b3c4d5e6f70',
      },
    },
    indexes: {
      searchVectorGinIndex: {
        universalIdentifier: '8e205171-ed74-4620-b7d2-674aab85033a',
      },
    },
    views: {
      allMessageLists: {
        universalIdentifier: 'c72bae18-75e9-4cb0-baeb-379d3529b98f',
        viewFields: {
          name: {
            universalIdentifier: 'c9767580-34e6-420b-923d-b4abd8c13d96',
          },
          members: {
            universalIdentifier: '6d314c4b-215a-4094-963a-ff9dd8221aea',
          },
          campaigns: {
            universalIdentifier: '037030a2-9dad-4bfd-957a-313b362172b4',
          },
          createdAt: {
            universalIdentifier: '29f3e7de-c40b-4597-8568-7318c146e4da',
          },
        },
      },
    },
  },
  messageListMember: {
    universalIdentifier: '27773d24-8ce3-40f8-aa6c-1f590f2c08d2',
    fields: {
      ...buildStandardObjectSystemFields(
        '27773d24-8ce3-40f8-aa6c-1f590f2c08d2',
      ),
      person: { universalIdentifier: '34288425-8805-42fb-8b98-ee13d09be3d3' },
      list: {
        universalIdentifier: 'd5402005-e8f9-4fbe-8696-b6723cd85018',
      },
    },
    indexes: {
      listIdIndex: {
        universalIdentifier: '61188470-6dcb-4b2a-b1a9-baeb688bccae',
      },
      personListUniqueIndex: {
        universalIdentifier: 'e5497dc2-1d72-418c-a389-a0645ca0195a',
      },
    },
  },
  messageChannelMessageAssociation: {
    universalIdentifier: '20202020-ad1e-4127-bccb-d83ae04d2ccb',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-ad1e-4127-bccb-d83ae04d2ccb',
      ),
      messageChannelId: {
        universalIdentifier: '20202020-b658-408f-bd46-3bd2d15d7e52',
      },
      message: {
        universalIdentifier: '20202020-da5d-4ac5-8743-342ab0a0336b',
      },
      messageExternalId: {
        universalIdentifier: '20202020-37d6-438f-b6fd-6503596c8f34',
      },
      messageThread: {
        universalIdentifier: '20202020-fac8-42a8-94dd-44dbc920ae16',
      },
      messageThreadExternalId: {
        universalIdentifier: '20202020-35fb-421e-afa0-0b8e8f7f9018',
      },
      direction: {
        universalIdentifier: '75c9b0f7-9e76-44d4-a2f9-47051e61eec7',
      },
      messageFolders: {
        universalIdentifier: '9bfc9da7-ae2d-44fd-9563-ede90c5d6222',
      },
    },
    indexes: {
      messageChannelIdIndex: {
        universalIdentifier: '9894f9a3-0225-4e7b-9f6a-23d4e2576784',
      },
      messageIdIndex: {
        universalIdentifier: '9bb24d40-60dd-4beb-8c64-a74e8c67f9ee',
      },
      messageChannelIdMessageIdUniqueIndex: {
        universalIdentifier: '1b86ece8-7ce3-4df3-8771-fd4b5d45b2f2',
      },
    },
    views: {
      allMessageChannelMessageAssociations: {
        universalIdentifier: 'a4f465ac-d5cb-4f24-93ac-7a24bafd398e',
        viewFields: {
          messageChannelId: {
            universalIdentifier: 'b86e652b-04ce-4089-9f71-e190eaf5b798',
          },
          message: {
            universalIdentifier: 'f9f2de0d-3db5-402b-a733-53be6a4667c8',
          },
          messageExternalId: {
            universalIdentifier: '7fb9801d-ca3d-4b2d-8d55-c922fcf7fefd',
          },
          direction: {
            universalIdentifier: 'ca38195e-985c-4880-85e0-26fa143c1ec7',
          },
          createdAt: {
            universalIdentifier: 'af239abd-2c55-4108-a9d8-b5a67f6ca2e2',
          },
        },
      },
      messageChannelMessageAssociationRecordPageFields: {
        universalIdentifier: '680b43e2-5d50-49d8-bbdd-2d208e7b7071',
        viewFieldGroups: {
          general: {
            universalIdentifier: '86d7066c-ba38-4f6a-996f-77345bedd549',
          },
          system: {
            universalIdentifier: '6044c58c-a63c-4f3f-a283-b8803553628f',
          },
        },
        viewFields: {
          messageChannelId: {
            universalIdentifier: '376c7685-9ebe-4c95-b820-424b1c2f264f',
          },
          message: {
            universalIdentifier: '166aa5a0-d825-40dc-be6d-e94b87edd56d',
          },
          messageExternalId: {
            universalIdentifier: '1910bd21-2472-4a83-b8cd-7de51bdd2675',
          },
          direction: {
            universalIdentifier: '9edfbd44-4624-4cf8-b81c-8e169b4e8281',
          },
          createdAt: {
            universalIdentifier: '8651c5c4-db87-427c-8a57-6a9f75c74976',
          },
          createdBy: {
            universalIdentifier: 'af4adf31-f698-4aad-9f29-71908924fc9a',
          },
        },
      },
    },
  },
  messageChannelMessageAssociationMessageFolder: {
    universalIdentifier: '20202020-a1b0-40b0-8ab0-5b6c7d8e9f0a',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-a1b0-40b0-8ab0-5b6c7d8e9f0a',
      ),
      messageChannelMessageAssociation: {
        universalIdentifier: '7411cfa3-4fd9-4b90-a636-940015fd7243',
      },
      messageFolderId: {
        universalIdentifier: 'b3369d31-3856-4a7a-b007-ee353918127c',
      },
    },
    indexes: {
      messageChannelMessageAssociationIdIndex: {
        universalIdentifier: '8e6038aa-1f79-4a84-87b5-f33caa172e98',
      },
      messageFolderIdIndex: {
        universalIdentifier: '905299c3-ca81-435d-901c-f68b87562516',
      },
      messageChannelMessageAssociationIdMessageFolderIdUniqueIndex: {
        universalIdentifier: 'a3de1788-5dff-4849-ac5a-0dabe5fab216',
      },
    },
    views: {
      allMessageChannelMessageAssociationMessageFolders: {
        universalIdentifier: '775610fe-f1d1-4959-bdc3-0b437059cfeb',
        viewFields: {
          messageChannelMessageAssociation: {
            universalIdentifier: '1251e67a-e795-4bc2-a468-6cfc838b6a0a',
          },
          messageFolderId: {
            universalIdentifier: 'aff2203d-6439-43b8-9cb4-55e8d78bba43',
          },
          createdAt: {
            universalIdentifier: '9da7637e-25c7-4101-8169-b5f6ff159690',
          },
        },
      },
      messageChannelMessageAssociationMessageFolderRecordPageFields: {
        universalIdentifier: '331ec548-07d2-4f9d-a0a2-ef91a9f96184',
        viewFieldGroups: {
          general: {
            universalIdentifier: '4928521b-ae24-4013-a69a-1392017d57af',
          },
          system: {
            universalIdentifier: 'b76cebb3-39b2-477a-9212-8bf1190227a4',
          },
        },
        viewFields: {
          messageChannelMessageAssociation: {
            universalIdentifier: 'd34ed53e-5156-4a18-a8df-572269496aac',
          },
          messageFolderId: {
            universalIdentifier: '04f14582-caf9-49ee-81ea-e5d4f977bfe1',
          },
          createdAt: {
            universalIdentifier: '39297559-a747-481e-a4c5-b80b8faf1aac',
          },
          createdBy: {
            universalIdentifier: '4692eb91-7fc6-4436-9175-87caa5f6b668',
          },
        },
      },
    },
  },
  messageParticipant: {
    universalIdentifier: '20202020-a433-4456-aa2d-fd9cb26b774a',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-a433-4456-aa2d-fd9cb26b774a',
      ),
      message: {
        universalIdentifier: '20202020-985b-429a-9db9-9e55f4898a2a',
      },
      role: {
        universalIdentifier: '20202020-65d1-42f4-8729-c9ec1f52aecd',
      },
      handle: {
        universalIdentifier: '20202020-2456-464e-b422-b965a4db4a0b',
      },
      displayName: {
        universalIdentifier: '20202020-36dd-4a4f-ac02-228425be9fac',
      },
      person: {
        universalIdentifier: '20202020-249d-4e0f-82cd-1b9df5cd3da2',
      },
      workspaceMember: {
        universalIdentifier: '20202020-77a7-4845-99ed-1bcbb478be6f',
      },
      messageCampaign: {
        universalIdentifier: '5bc768db-919f-41da-8c43-df08084d526f',
      },
    },
    indexes: {
      messageIdIndex: {
        universalIdentifier: 'ab0863ba-f95e-493c-b86c-56e1bc7e5bc2',
      },
      personIdIndex: {
        universalIdentifier: 'df805c2e-3bfe-4d51-8309-75e5eb4052fe',
      },
      workspaceMemberIdIndex: {
        universalIdentifier: 'ce1e3a9e-afe9-439d-abb7-6cc98a6fa405',
      },
      messageCampaignIdIndex: {
        universalIdentifier: 'e9bcdd77-cc8b-4532-833c-124dfdc8e5ff',
      },
    },
    views: {
      allMessageParticipants: {
        universalIdentifier: '8b7fbe7d-dae0-4285-8bdc-ec078a4de870',
        viewFields: {
          message: {
            universalIdentifier: 'ca491a31-8659-4202-9476-f0f72efc80b5',
          },
          role: {
            universalIdentifier: '55b74f7e-7c58-4fce-a44b-a8d9671ec541',
          },
          handle: {
            universalIdentifier: 'abcbb5d9-b8c2-46bb-b3cc-ea035be8f3be',
          },
          displayName: {
            universalIdentifier: '8d0c8202-b57f-4450-a090-a7eb26aa2299',
          },
          person: {
            universalIdentifier: '26d0f3f1-43d3-425c-930c-81147451d0f8',
          },
          workspaceMember: {
            universalIdentifier: 'df62dcbc-c22d-4d34-9fa5-6f70bae02161',
          },
          createdAt: {
            universalIdentifier: '636ff7b6-86b8-49fc-9442-39f4c24ff424',
          },
        },
      },
      messageParticipantRecordPageFields: {
        universalIdentifier: '209ab5c5-4a68-4d32-8255-515919a6c5f5',
        viewFieldGroups: {
          general: {
            universalIdentifier: '41c18430-34c3-430f-b86b-fc3963281277',
          },
          system: {
            universalIdentifier: 'add21830-a7c6-4cde-9eed-430afbcbf557',
          },
        },
        viewFields: {
          message: {
            universalIdentifier: 'dd8ccf4f-64d7-468c-bc0c-dc4e0efef08d',
          },
          role: {
            universalIdentifier: '5d1f9a65-85cc-41b2-a8bf-8e2c97aab4b3',
          },
          displayName: {
            universalIdentifier: 'c50748fe-9f54-4e09-b572-111f076ec7db',
          },
          person: {
            universalIdentifier: 'bf2e30dd-df03-4fb2-820a-166a93a2ce2c',
          },
          workspaceMember: {
            universalIdentifier: '00336686-0d63-43e2-b247-599f1227bd85',
          },
          createdAt: {
            universalIdentifier: '8d66ecb8-825d-4c6c-91c0-23a82c87ab46',
          },
          createdBy: {
            universalIdentifier: '17c3acfc-71f1-4b3c-820e-aea23871e850',
          },
        },
      },
    },
  },
  messageThread: {
    universalIdentifier: '20202020-849a-4c3e-84f5-a25a7d802271',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-849a-4c3e-84f5-a25a7d802271',
      ),
      messages: {
        universalIdentifier: '20202020-3115-404f-aade-e1154b28e35a',
      },
      messageChannelMessageAssociations: {
        universalIdentifier: '20202020-314e-40a4-906d-a5d5d6c285f6',
      },
      subject: {
        universalIdentifier: 'a8ddbf8c-1137-45d1-b89e-5ffbd83f67c8',
      },
    },
    indexes: {},
    views: {
      allMessageThreads: {
        universalIdentifier: '20202020-d002-4d02-8d02-ae55a9ba2002',
        viewFields: {
          subject: {
            universalIdentifier: 'e5f0d32b-2b6a-47bc-b3bd-f32c96594ec1',
          },
          messages: {
            universalIdentifier: '20202020-df02-4d02-8d02-ae55a9ba2f01',
          },
          updatedAt: {
            universalIdentifier: 'af2c6ac9-7083-4609-8172-d518441f5e9e',
          },
          createdAt: {
            universalIdentifier: '20202020-df02-4d02-8d02-ae55a9ba2f02',
          },
        },
      },
    },
  },
  message: {
    universalIdentifier: '20202020-3f6b-4425-80ab-e468899ab4b2',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-3f6b-4425-80ab-e468899ab4b2',
      ),
      headerMessageId: {
        universalIdentifier: '20202020-72b5-416d-aed8-b55609067d01',
      },
      messageThread: {
        universalIdentifier: '20202020-30f2-4ccd-9f5c-e41bb9d26214',
      },
      subject: { universalIdentifier: '20202020-52d1-4036-b9ae-84bd722bb37a' },
      text: { universalIdentifier: '20202020-d2ee-4e7e-89de-9a0a9044a143' },
      receivedAt: {
        universalIdentifier: '20202020-140a-4a2a-9f86-f13b6a979afc',
      },
      messageParticipants: {
        universalIdentifier: '20202020-7cff-4a74-b63c-73228448cbd9',
      },
      messageChannelMessageAssociations: {
        universalIdentifier: '20202020-3cef-43a3-82c6-50e7cfbc9ae4',
      },
      messageCampaign: {
        universalIdentifier: '77cff00b-a0ba-48d6-80de-0d5ccf14e45b',
      },
      deliveryStatus: {
        universalIdentifier: '209254fa-2b89-429d-a72a-c401c4bd5a78',
      },
      isDraft: {
        universalIdentifier: '20202020-4d3a-4b6e-9c1f-2a5e7b9d0c34',
      },
    },
    indexes: {
      messageThreadIdIndex: {
        universalIdentifier: '7a05b45e-7aa6-4a7e-9bbc-299cbed53c96',
      },
      messageCampaignIdIndex: {
        universalIdentifier: '79e777ca-7008-46c5-b3a6-3108b7c7dfb6',
      },
    },
    views: {
      allMessages: {
        universalIdentifier: '20202020-d001-4d01-8d01-ae55a9e5a001',
        viewFields: {
          subject: {
            universalIdentifier: '20202020-df01-4d01-8d01-ae55a9e5af01',
          },
          messageThread: {
            universalIdentifier: '20202020-df01-4d01-8d01-ae55a9e5af02',
          },
          messageParticipants: {
            universalIdentifier: '20202020-df01-4d01-8d01-ae55a9e5af03',
          },
          receivedAt: {
            universalIdentifier: '20202020-df01-4d01-8d01-ae55a9e5af04',
          },
          headerMessageId: {
            universalIdentifier: '20202020-df01-4d01-8d01-ae55a9e5af05',
          },
          text: {
            universalIdentifier: '20202020-df01-4d01-8d01-ae55a9e5af06',
          },
          createdAt: {
            universalIdentifier: '20202020-df01-4d01-8d01-ae55a9e5af07',
          },
        },
      },
    },
  },
  note: {
    universalIdentifier: '20202020-0b00-45cd-b6f6-6cd806fc6804',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-0b00-45cd-b6f6-6cd806fc6804',
      ),
      title: { universalIdentifier: '20202020-faeb-4c76-8ba6-ccbb0b4a965f' },
      bodyV2: { universalIdentifier: '20202020-a7bb-4d94-be51-8f25181502c8' },
      noteTargets: {
        universalIdentifier: '20202020-1f25-43fe-8b00-af212fdde823',
      },
      attachments: {
        universalIdentifier: '20202020-4986-4c92-bf19-39934b149b16',
      },
      timelineActivities: {
        universalIdentifier: '20202020-7030-42f8-929c-1a57b25d6bce',
      },
    },
    indexes: {
      searchVectorGinIndex: {
        universalIdentifier: '8183c8d2-9114-4b6e-8c5d-12a3b14a5a13',
      },
    },
    views: {
      allNotes: {
        universalIdentifier: '20202020-a005-4a05-8a05-a0be5a11a000',
        viewFields: {
          title: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a11af00',
          },
          noteTargets: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a11af01',
          },
          bodyV2: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a11af02',
          },
          createdBy: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a11af03',
          },
          createdAt: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a11af04',
          },
        },
      },
      noteRecordPageFields: {
        universalIdentifier: '20202020-a005-4a05-8a05-a0be5a115001',
        viewFieldGroups: {
          general: {
            universalIdentifier: '20202020-a005-4a05-8a05-a0be5a115101',
          },
          system: {
            universalIdentifier: '20202020-a005-4a05-8a05-a0be5a115103',
          },
        },
        viewFields: {
          createdAt: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a115202',
          },
          createdBy: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a115203',
          },
          noteTargets: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a115204',
          },
          bodyV2: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a115205',
          },
          updatedAt: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a115206',
          },
          updatedBy: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a115207',
          },
          attachments: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a115208',
          },
          timelineActivities: {
            universalIdentifier: '20202020-af05-4a05-8a05-a0be5a115209',
          },
        },
      },
    },
  },
  noteTarget: {
    universalIdentifier: '20202020-fff0-4b44-be82-bda313884400',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-fff0-4b44-be82-bda313884400',
      ),
      note: { universalIdentifier: '20202020-57f3-4f50-9599-fc0f671df003' },
      targetPerson: {
        universalIdentifier: '20202020-38ca-4aab-92f5-8a605ca2e4c5',
      },
      targetCompany: {
        universalIdentifier: 'c500fbc0-d6f2-4982-a959-5a755431696c',
      },
      targetOpportunity: {
        universalIdentifier: '20202020-4e42-417a-a705-76581c9ade79',
      },
      targetSearchEngagementTerms: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8bc2',
      },
      targetClientAccountProfile: {
        universalIdentifier: '20202020-a1b2-4c3d-8e5f-6a7b8c9d0e02',
      },
    },
    morphIds: {
      targetMorphId: { morphId: '20202020-f635-435d-ab8d-e1168b375c70' },
    },
    indexes: {
      noteIdIndex: {
        universalIdentifier: '9294d9e3-0225-4c7f-9d6e-23b4c25b6b24',
      },
      personIdIndex: {
        universalIdentifier: '7c069dc0-e83b-4cd5-aaa2-cac7f3e00d80',
      },
      companyIdIndex: {
        universalIdentifier: '2d83909a-a383-4e82-b00a-8b7739f3f906',
      },
      opportunityIdIndex: {
        universalIdentifier: '0d1a59b4-cc87-4b7d-804a-656e8504f371',
      },
    },
    views: {
      allNoteTargets: {
        universalIdentifier: 'd124d587-ef78-402b-9341-7673e6cea033',
        viewFields: {
          id: {
            universalIdentifier: 'f2d912fe-7c6f-4a9c-b808-b7b5a18d2818',
          },
          note: {
            universalIdentifier: '9d4ac173-d32b-4a44-9dbd-8a47ab844f98',
          },
          targetPerson: {
            universalIdentifier: 'b6f67de5-c5cf-4235-b740-a6a007c8eae3',
          },
          targetCompany: {
            universalIdentifier: 'a9c7f370-4b22-4f29-8e3f-678e91a59576',
          },
          targetOpportunity: {
            universalIdentifier: '3efeb162-cd03-458b-9c7b-47032d045204',
          },
        },
      },
    },
  },
  opportunity: {
    universalIdentifier: '20202020-9549-49dd-b2b2-883999db8938',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-9549-49dd-b2b2-883999db8938',
      ),
      name: { universalIdentifier: '20202020-8609-4f65-a2d9-44009eb422b5' },
      amount: { universalIdentifier: '20202020-583e-4642-8533-db761d5fa82f' },
      closeDate: {
        universalIdentifier: '20202020-527e-44d6-b1ac-c4158d307b97',
      },
      stage: { universalIdentifier: '20202020-6f76-477d-8551-28cd65b2b4b9' },
      pointOfContact: {
        universalIdentifier: '20202020-8dfb-42fc-92b6-01afb759ed16',
      },
      company: { universalIdentifier: '20202020-cbac-457e-b565-adece5fc815f' },
      owner: { universalIdentifier: '20202020-be7e-4d1e-8e19-3d5c7c4b9f2a' },
      taskTargets: {
        universalIdentifier: '20202020-59c0-4179-a208-4a255f04a5be',
      },
      noteTargets: {
        universalIdentifier: '20202020-dd3f-42d5-a382-db58aabf43d3',
      },
      attachments: {
        universalIdentifier: '20202020-87c7-4118-83d6-2f4031005209',
      },
      timelineActivities: {
        universalIdentifier: '20202020-30e2-421f-96c7-19c69d1cf631',
      },
      searchEngagementTerms: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8bb3',
      },
      // BD-specific fields
      searchType: {
        universalIdentifier: '20202020-0101-4101-8101-010101010001',
      },
      expectedFeeFloor: {
        universalIdentifier: '20202020-0102-4102-8102-010101010002',
      },
      expectedFeeCeiling: {
        universalIdentifier: '20202020-0103-4103-8103-010101010003',
      },
      expectedTimeline: {
        universalIdentifier: '20202020-0104-4104-8104-010101010004',
      },
      decisionDate: {
        universalIdentifier: '20202020-0105-4105-8105-010101010005',
      },
      decisionCriteria: {
        universalIdentifier: '20202020-0106-4106-8106-010101010006',
      },
      searchAssignments: {
        universalIdentifier: '41e656f3-0efe-45a1-a2ba-b704e209acce',
      },
    },
    indexes: {
      pointOfContactIdIndex: {
        universalIdentifier: 'b8c2a673-a981-4357-a43d-313a358e4daa',
      },
      companyIdIndex: {
        universalIdentifier: 'e161072d-37b1-477a-b944-ef0d65289574',
      },
      stageIndex: {
        universalIdentifier: 'ae60d580-b562-44f2-a24d-7b8040063f83',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'f53fdd28-a26b-47ba-81b5-6813ad622720',
      },
    },
    views: {
      allOpportunities: {
        universalIdentifier: '20202020-a003-4a03-8a03-0aa0b1ca1ba0',
        viewFields: {
          name: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca1baf',
          },
          amount: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca1bb0',
          },
          createdBy: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca1bb1',
          },
          closeDate: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca1bb2',
          },
          company: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca1bb3',
          },
          pointOfContact: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca1bb4',
          },
        },
      },
      byStage: {
        universalIdentifier: '20202020-a004-4a04-8a04-0aa0b1ca1ba0',
        viewFields: {
          name: {
            universalIdentifier: '20202020-af04-4a04-8a04-0aa0b2ca2baf',
          },
          amount: {
            universalIdentifier: '20202020-af04-4a04-8a04-0aa0b2ca2bb0',
          },
          createdBy: {
            universalIdentifier: '20202020-af04-4a04-8a04-0aa0b2ca2bb1',
          },
          closeDate: {
            universalIdentifier: '20202020-af04-4a04-8a04-0aa0b2ca2bb2',
          },
          company: {
            universalIdentifier: '20202020-af04-4a04-8a04-0aa0b2ca2bb3',
          },
          pointOfContact: {
            universalIdentifier: '20202020-af04-4a04-8a04-0aa0b2ca2bb4',
          },
        },
        viewGroups: {
          new: {
            universalIdentifier: '20202020-af14-4a04-8a04-0aa0b2ca2bf1',
          },
          screening: {
            universalIdentifier: '20202020-af14-4a04-8a04-0aa0b2ca2bf2',
          },
          meeting: {
            universalIdentifier: '20202020-af14-4a04-8a04-0aa0b2ca2bf3',
          },
          proposal: {
            universalIdentifier: '20202020-af14-4a04-8a04-0aa0b2ca2bf4',
          },
          customer: {
            universalIdentifier: '20202020-af14-4a04-8a04-0aa0b2ca2bf5',
          },
        },
      },
      opportunityRecordPageFields: {
        universalIdentifier: '20202020-a003-4a03-8a03-0aa0b1ca3001',
        viewFieldGroups: {
          deal: {
            universalIdentifier: '20202020-a003-4a03-8a03-0aa0b1ca3101',
          },
          relations: {
            universalIdentifier: '20202020-a003-4a03-8a03-0aa0b1ca3102',
          },
          system: {
            universalIdentifier: '20202020-a003-4a03-8a03-0aa0b1ca3103',
          },
        },
        viewFields: {
          amount: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca3201',
          },
          closeDate: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca3202',
          },
          stage: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca3203',
          },
          company: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca3204',
          },
          pointOfContact: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca3205',
          },
          owner: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca3206',
          },
          createdAt: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca3207',
          },
          createdBy: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca3208',
          },
          updatedAt: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca320a',
          },
          updatedBy: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca320b',
          },
          taskTargets: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca320d',
          },
          noteTargets: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca320e',
          },
          attachments: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca320f',
          },
          timelineActivities: {
            universalIdentifier: '20202020-af03-4a03-8a03-0aa0b1ca3210',
          },
        },
      },
    },
  },
  person: {
    universalIdentifier: '20202020-e674-48e5-a542-72570eee7213',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-e674-48e5-a542-72570eee7213',
      ),
      name: { universalIdentifier: '20202020-3875-44d5-8c33-a6239011cab8' },
      emails: { universalIdentifier: '20202020-3c51-43fa-8b6e-af39e29368ab' },
      linkedinLink: {
        universalIdentifier: '20202020-f1af-48f7-893b-2007a73dd508',
      },
      jobTitle: { universalIdentifier: '20202020-b0d0-415a-bef9-640a26dacd9b' },
      phones: { universalIdentifier: '20202020-0638-448e-8825-439134618022' },
      avatarUrl: {
        universalIdentifier: '20202020-b8a6-40df-961c-373dc5d2ec21',
      },
      avatarFile: {
        universalIdentifier: '20202020-a7c9-4e3d-8f1b-2d5a6b7c8e9f',
      },
      company: { universalIdentifier: '20202020-e2f3-448e-b34c-2d625f0025fd' },
      pointOfContactForOpportunities: {
        universalIdentifier: '20202020-911b-4a7d-b67b-918aa9a5b33a',
      },
      taskTargets: {
        universalIdentifier: '20202020-584b-4d3e-88b6-53ab1fa03c3a',
      },
      noteTargets: {
        universalIdentifier: '20202020-c8fc-4258-8250-15905d3fcfec',
      },
      attachments: {
        universalIdentifier: '20202020-cd97-451f-87fa-bcb789bdbf3a',
      },
      messageParticipants: {
        universalIdentifier: '20202020-498e-4c61-8158-fa04f0638334',
      },
      calendarEventParticipants: {
        universalIdentifier: '20202020-52ee-45e9-a702-b64b3753e3a9',
      },
      timelineActivities: {
        universalIdentifier: '20202020-a43e-4873-9c23-e522de906ce5',
      },
      listMemberships: {
        universalIdentifier: '8b8d1be0-4c94-4413-a2c9-c7ede205a81d',
      },
      billingContactForClientAccountProfiles: {
        universalIdentifier: '20202020-3d7e-4ea4-9d8d-a87e5e325040',
      },
      confidentialityRecords: {
        universalIdentifier: '20202020-c9d0-4415-6071-4c5d6e7f8a9b',
      },
      conflictCheckSubjectPersons: {
        universalIdentifier: '20202020-d0e1-4526-7182-5d6e7f8a9b0c',
      },
      targetOfSourceRelationshipEdges: {
        universalIdentifier: '20202020-e1f2-4637-8293-6e7f8a9b0c1d',
      },
      targetOfTargetRelationshipEdges: {
        universalIdentifier: '20202020-f2a3-4748-9304-7f8a9b0c1d2e',
      },
      researchCandidates: {
        universalIdentifier: '20202020-a3b4-4859-0415-8a9b0c1d2e3f',
      },
      candidacies: {
        universalIdentifier: '20202020-c001-4859-0415-8a9b0c1d2e40',
      },
    },
    indexes: {
      companyIdIndex: {
        universalIdentifier: '8a265a5c-d3ae-47dc-bdf9-b42cfa2ba639',
      },
      emailsUniqueIndex: {
        universalIdentifier: '8183a8b2-9114-4f6c-8a5b-12e3f14e5e13',
      },
      searchVectorGinIndex: {
        universalIdentifier: '9294b9c3-0225-4a7d-9b6c-23f4a25f6f24',
      },
    },
    views: {
      allPeople: {
        universalIdentifier: '20202020-a002-4a02-8a02-ae0a1ea11a00',
        viewFields: {
          name: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea11af0',
          },
          emails: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea11af1',
          },
          createdBy: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea11af2',
          },
          company: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea11af3',
          },
          phones: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea11af4',
          },
          createdAt: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea11af5',
          },
          jobTitle: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea11af7',
          },
          linkedinLink: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea11af8',
          },
        },
      },
      personRecordPageFields: {
        universalIdentifier: '20202020-a002-4a02-8a02-ae0a1ea12001',
        viewFieldGroups: {
          general: {
            universalIdentifier: '20202020-a002-4a02-8a02-ae0a1ea12101',
          },
          work: {
            universalIdentifier: '20202020-a002-4a02-8a02-ae0a1ea12102',
          },
          social: {
            universalIdentifier: '20202020-a002-4a02-8a02-ae0a1ea12103',
          },
          system: {
            universalIdentifier: '20202020-a002-4a02-8a02-ae0a1ea12104',
          },
        },
        viewFields: {
          emails: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12201',
          },
          phones: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12202',
          },
          company: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12203',
          },
          jobTitle: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12204',
          },
          linkedinLink: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12205',
          },
          avatarUrl: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12208',
          },
          createdAt: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12209',
          },
          createdBy: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12210',
          },
          updatedAt: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12212',
          },
          updatedBy: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12213',
          },
          avatarFile: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12214',
          },
          pointOfContactForOpportunities: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12215',
          },
          taskTargets: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12216',
          },
          noteTargets: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12217',
          },
          attachments: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea12219',
          },
          messageParticipants: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea1221a',
          },
          calendarEventParticipants: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea1221b',
          },
          timelineActivities: {
            universalIdentifier: '20202020-af02-4a02-8a02-ae0a1ea1221c',
          },
        },
      },
    },
  },
  task: {
    universalIdentifier: '20202020-1ba1-48ba-bc83-ef7e5990ed10',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-1ba1-48ba-bc83-ef7e5990ed10',
      ),
      title: { universalIdentifier: '20202020-b386-4cb7-aa5a-08d4a4d92680' },
      bodyV2: { universalIdentifier: '20202020-4aa0-4ae8-898d-7df0afd47ab1' },
      dueAt: { universalIdentifier: '20202020-fd99-40da-951b-4cb9a352fce3' },
      status: { universalIdentifier: '20202020-70bc-48f9-89c5-6aa730b151e0' },
      taskTargets: {
        universalIdentifier: '20202020-de9c-4d0e-a452-713d4a3e5fc7',
      },
      attachments: {
        universalIdentifier: '20202020-794d-4783-a8ff-cecdb15be139',
      },
      assignee: { universalIdentifier: '20202020-065a-4f42-a906-e20422c1753f' },
      timelineActivities: {
        universalIdentifier: '20202020-c778-4278-99ee-23a2837aee64',
      },
    },
    indexes: {
      assigneeIdIndex: {
        universalIdentifier: 'f48fa3b1-0cec-44da-a9e5-f8a5e766637e',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'a86b32b3-01d3-4302-a152-8b7f247db7b4',
      },
    },
    views: {
      allTasks: {
        universalIdentifier: '20202020-a006-4a06-8a06-ba5ca11a1ea0',
        viewFields: {
          title: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a1eaf',
          },
          status: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a1eb0',
          },
          taskTargets: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a1eb1',
          },
          createdBy: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a1eb2',
          },
          dueAt: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a1eb3',
          },
          assignee: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a1eb4',
          },
          bodyV2: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a1eb5',
          },
          createdAt: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a1eb6',
          },
        },
      },
      assignedToMe: {
        universalIdentifier: '20202020-a007-4a07-8a07-ba5ca551aaed',
        viewFields: {
          title: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaed',
          },
          taskTargets: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaee',
          },
          createdBy: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaef',
          },
          dueAt: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaf0',
          },
          assignee: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaf1',
          },
          bodyV2: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaf2',
          },
          createdAt: {
            universalIdentifier: '20202020-af07-4a07-8a07-ba5ca551aaf3',
          },
        },
        viewFilters: {
          assigneeIsMe: {
            universalIdentifier: '20202020-af17-4a07-8a07-ba5ca551abf1',
          },
        },
        viewGroups: {
          todo: {
            universalIdentifier: '20202020-af17-4a07-8a07-ba5ca551abf2',
          },
          inProgress: {
            universalIdentifier: '20202020-af17-4a07-8a07-ba5ca551abf3',
          },
          done: {
            universalIdentifier: '20202020-af17-4a07-8a07-ba5ca551abf4',
          },
          empty: {
            universalIdentifier: '20202020-af17-4a07-8a07-ba5ca551abf5',
          },
        },
      },
      byStatus: {
        universalIdentifier: '20202020-a008-4a08-8a08-ba5cba51aba5',
        viewFields: {
          title: {
            universalIdentifier: '20202020-af08-4a08-8a08-ba5cba5babf0',
          },
          status: {
            universalIdentifier: '20202020-af08-4a08-8a08-ba5cba5babf1',
          },
          dueAt: {
            universalIdentifier: '20202020-af08-4a08-8a08-ba5cba5babf2',
          },
          assignee: {
            universalIdentifier: '20202020-af08-4a08-8a08-ba5cba5babf3',
          },
          createdAt: {
            universalIdentifier: '20202020-af08-4a08-8a08-ba5cba5babf4',
          },
        },
        viewGroups: {
          todo: {
            universalIdentifier: '20202020-af18-4a08-8a08-ba5cba5bbf01',
          },
          inProgress: {
            universalIdentifier: '20202020-af18-4a08-8a08-ba5cba5bbf02',
          },
          done: {
            universalIdentifier: '20202020-af18-4a08-8a08-ba5cba5bbf03',
          },
        },
      },
      taskRecordPageFields: {
        universalIdentifier: '20202020-a006-4a06-8a06-ba5ca11a6001',
        viewFieldGroups: {
          general: {
            universalIdentifier: '20202020-a006-4a06-8a06-ba5ca11a6101',
          },
          system: {
            universalIdentifier: '20202020-a006-4a06-8a06-ba5ca11a6103',
          },
        },
        viewFields: {
          dueAt: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a6202',
          },
          status: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a6203',
          },
          assignee: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a6204',
          },
          createdAt: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a6205',
          },
          createdBy: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a6206',
          },
          taskTargets: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a6207',
          },
          bodyV2: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a6208',
          },
          updatedAt: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a6209',
          },
          updatedBy: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a620a',
          },
          attachments: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a620b',
          },
          timelineActivities: {
            universalIdentifier: '20202020-af06-4a06-8a06-ba5ca11a620c',
          },
        },
      },
    },
  },
  taskTarget: {
    universalIdentifier: '20202020-5a9a-44e8-95df-771cd06d0fb1',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-5a9a-44e8-95df-771cd06d0fb1',
      ),
      task: { universalIdentifier: '20202020-e881-457a-8758-74aaef4ae78a' },
      targetPerson: {
        universalIdentifier: '20202020-c8a0-4e85-a016-87e2349cfbec',
      },
      targetCompany: {
        universalIdentifier: '20202020-4703-4a4e-948c-487b0c60a92c',
      },
      targetOpportunity: {
        universalIdentifier: '20202020-6cb2-4c01-a9a5-aca3dbc11d41',
      },
      targetSearchEngagementTerms: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8bc3',
      },
      targetClientAccountProfile: {
        universalIdentifier: '20202020-a1b2-4c3d-8e5f-6a7b8c9d0e03',
      },
    },
    morphIds: {
      targetMorphId: { morphId: '20202020-f636-435d-ab8d-e1168b375c71' },
    },
    indexes: {
      taskIdIndex: {
        universalIdentifier: 'c882f7a4-b025-4d32-aa26-5ef2595bdbf9',
      },
      personIdIndex: {
        universalIdentifier: 'b7d305d1-6fae-4ed6-9bdc-354fe9032c0e',
      },
      companyIdIndex: {
        universalIdentifier: 'c0af54c7-751b-4bb2-b102-677cc4e47402',
      },
      opportunityIdIndex: {
        universalIdentifier: '6942e0ba-90f6-4c33-bf40-7f00b1ec35ab',
      },
    },
    views: {
      allTaskTargets: {
        universalIdentifier: '1dbf1d24-6cca-4f55-ae2f-e3d1b425a495',
        viewFields: {
          id: {
            universalIdentifier: 'a49287c9-8aa6-4fca-9ec5-08d643f7239f',
          },
          task: {
            universalIdentifier: '1f79839e-42f6-4a69-839a-369e21a7497d',
          },
          targetPerson: {
            universalIdentifier: 'cadc7a33-1527-4ef8-ac00-7ed0b54d1bae',
          },
          targetCompany: {
            universalIdentifier: 'e9fa1305-4ba2-41c5-9198-fdc622b69f90',
          },
          targetOpportunity: {
            universalIdentifier: '526f3354-34d6-4e7e-a870-5f99c28353c2',
          },
        },
      },
    },
  },
  timelineActivity: {
    universalIdentifier: '20202020-6736-4337-b5c4-8b39fae325a5',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-6736-4337-b5c4-8b39fae325a5',
      ),
      name: { universalIdentifier: '20202020-7207-46e8-9dab-849505ae8497' },
      happensAt: {
        universalIdentifier: '20202020-9526-4993-b339-c4318c4d39f0',
      },
      properties: {
        universalIdentifier: '20202020-f142-4b04-b91b-6a2b4af3bf11',
      },
      workspaceMember: {
        universalIdentifier: '20202020-af23-4479-9a30-868edc474b36',
      },
      targetPerson: {
        universalIdentifier: '20202020-c414-45b9-a60a-ac27aa96229f',
      },
      targetCompany: {
        universalIdentifier: '20202020-04ad-4221-a744-7a8278a5ce21',
      },
      targetOpportunity: {
        universalIdentifier: '20202020-7664-4a35-a3df-580d389fd527',
      },
      targetTask: {
        universalIdentifier: '20202020-b2f5-415c-9135-a31dfe49501b',
      },
      targetNote: {
        universalIdentifier: '20202020-ec55-4135-8da5-3a20badc0156',
      },
      targetWorkflow: {
        universalIdentifier: '20202020-616c-4ad3-a2e9-c477c341e295',
      },
      targetWorkflowVersion: {
        universalIdentifier: '20202020-74f1-4711-a129-e14ca0ecd744',
      },
      targetWorkflowRun: {
        universalIdentifier: '20202020-96f0-401b-9186-a3a0759225ac',
      },
      targetDashboard: {
        universalIdentifier: '20202020-7864-48f5-af7c-9e4b60140948',
      },
      targetMessageList: {
        universalIdentifier: 'd9f4a1b2-3c5e-4d70-8e91-0a2b3c4d5e6f',
      },
      targetMessageCampaign: {
        universalIdentifier: 'b2c3d4e5-6f70-4b81-8c92-03d4e5f60718',
      },
      linkedRecordCachedName: {
        universalIdentifier: '20202020-cfdb-4bef-bbce-a29f41230934',
      },
      linkedRecordId: {
        universalIdentifier: '20202020-2e0e-48c0-b445-ee6c1e61687d',
      },
      linkedObjectMetadataId: {
        universalIdentifier: '20202020-c595-449d-9f89-562758c9ee69',
      },
      targetSearchEngagementTerms: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8bc4',
      },
      targetClientAccountProfile: {
        universalIdentifier: '20202020-a1b2-4c3d-8e5f-6a7b8c9d0e04',
      },
    },
    morphIds: {
      targetMorphId: { morphId: '20202020-9a2b-4c3d-a4e5-f6a7b8c9d0e1' },
    },
    indexes: {
      workspaceMemberIdIndex: {
        universalIdentifier: '5e0b2391-85ca-4a66-aef4-52d74245bec2',
      },
      personIdIndex: {
        universalIdentifier: '3e89a914-7bec-47bd-9cf9-743c6b83d001',
      },
      companyIdIndex: {
        universalIdentifier: '8183e8f2-9114-4d6a-8e5f-12c3d14c5c13',
      },
      opportunityIdIndex: {
        universalIdentifier: '9294f9a3-0225-4e7b-9f6a-23d4e25d6d24',
      },
      noteIdIndex: {
        universalIdentifier: '995db1d8-0d3e-40f7-b0eb-5e6897bc9966',
      },
      taskIdIndex: {
        universalIdentifier: '609cf622-86ef-48d1-812b-e1cab610a46c',
      },
      workflowIdIndex: {
        universalIdentifier: 'd6059ec2-92b0-4cfc-9fd8-78050f03108f',
      },
      workflowVersionIdIndex: {
        universalIdentifier: 'd94329b3-5dc8-4141-ae28-31afe28f7135',
      },
      workflowRunIdIndex: {
        universalIdentifier: '1a2bd046-7c23-4e0a-9f8a-c3ca3a16d3b9',
      },
      dashboardIdIndex: {
        universalIdentifier: 'e8821da9-728d-470a-bf5b-5a981fff7880',
      },
    },
    views: {
      allTimelineActivities: {
        universalIdentifier: '20202020-b101-4b01-8b01-ba5cc01aa001',
        viewFields: {
          name: {
            universalIdentifier: '20202020-bf01-4b01-8b01-ba5cc01aa011',
          },
          happensAt: {
            universalIdentifier: '20202020-bf01-4b01-8b01-ba5cc01aa012',
          },
          properties: {
            universalIdentifier: '20202020-bf01-4b01-8b01-ba5cc01aa019',
          },
          workspaceMember: {
            universalIdentifier: '20202020-bf01-4b01-8b01-ba5cc01aa013',
          },
          linkedRecordCachedName: {
            universalIdentifier: '20202020-bf01-4b01-8b01-ba5cc01aa017',
          },
          targetPerson: {
            universalIdentifier: '37b38a8b-abd7-4f72-92d2-ad82bbef0296',
          },
          targetCompany: {
            universalIdentifier: '2015825f-0786-4b0d-88a7-dfce1b4b1c1a',
          },
          targetOpportunity: {
            universalIdentifier: 'f7b5ced9-eba6-4454-8849-7a92d27c11ca',
          },
          targetTask: {
            universalIdentifier: '3899138d-e6fa-414c-9432-214c9b797ebb',
          },
          targetNote: {
            universalIdentifier: 'ab74ed52-0195-4b65-987a-8367c07ee222',
          },
          targetWorkflow: {
            universalIdentifier: 'd2c3ddc3-afad-40b9-a2cb-d2765f2f5691',
          },
          targetWorkflowVersion: {
            universalIdentifier: '4a7e3213-afd5-4691-8bba-0a10e8697afb',
          },
          targetWorkflowRun: {
            universalIdentifier: '97910946-04f0-4634-804e-880bc0019225',
          },
          targetDashboard: {
            universalIdentifier: '538847e8-ab09-407c-a433-505f6d7be7a1',
          },
        },
      },
    },
  },
  workflow: {
    universalIdentifier: '20202020-62be-406c-b9ca-8caa50d51392',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-62be-406c-b9ca-8caa50d51392',
      ),
      name: { universalIdentifier: '20202020-b3d3-478f-acc0-5d901e725b20' },
      lastPublishedVersionId: {
        universalIdentifier: '20202020-326a-4fba-8639-3456c0a169e8',
      },
      statuses: { universalIdentifier: '20202020-357c-4432-8c50-8c31b4a552d9' },
      versions: { universalIdentifier: '20202020-9432-416e-8f3c-27ee3153d099' },
      runs: { universalIdentifier: '20202020-759b-4340-b58b-e73595c4df4f' },
      automatedTriggers: {
        universalIdentifier: '20202020-3319-4234-a34c-117ecad2b8a9',
      },
      timelineActivities: {
        universalIdentifier: '20202020-906e-486a-a798-131a5f081faf',
      },
      attachments: {
        universalIdentifier: '20202020-4a8c-4e2d-9b1c-7e5f3a2b4c6d',
      },
    },
    indexes: {
      searchVectorGinIndex: {
        universalIdentifier: 'c7e64c55-eb0c-4b93-b076-5cfcf2e2e042',
      },
    },
    views: {
      allWorkflows: {
        universalIdentifier: '20202020-a009-4a09-8a09-a0bcf10aa11a',
        viewFields: {
          name: {
            universalIdentifier: '20202020-af09-4a09-8a09-a0bcf10aa11a',
          },
          statuses: {
            universalIdentifier: '20202020-af09-4a09-8a09-a0bcf10aa11b',
          },
          updatedAt: {
            universalIdentifier: '20202020-af09-4a09-8a09-a0bcf10aa11c',
          },
          createdBy: {
            universalIdentifier: '20202020-af09-4a09-8a09-a0bcf10aa11d',
          },
          versions: {
            universalIdentifier: '20202020-af09-4a09-8a09-a0bcf10aa11e',
          },
          runs: {
            universalIdentifier: '20202020-af09-4a09-8a09-a0bcf10aa11f',
          },
        },
      },
    },
  },
  workflowAutomatedTrigger: {
    universalIdentifier: '20202020-3319-4234-a34c-7f3b9d2e4d1f',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-3319-4234-a34c-7f3b9d2e4d1f',
      ),
      type: {
        universalIdentifier: '20202020-3319-4234-a34c-3f92c1ab56e7',
      },
      settings: {
        universalIdentifier: '20202020-3319-4234-a34c-bac8f903de12',
      },
      workflow: {
        universalIdentifier: '20202020-3319-4234-a34c-8e1a4d2f7c03',
      },
    },
    indexes: {
      workflowIdIndex: {
        universalIdentifier: '7331ff89-a3f9-4ac0-9fa9-0de5663ae7b2',
      },
    },
    views: {
      allWorkflowAutomatedTriggers: {
        universalIdentifier: 'a0a9ef79-3d42-417a-8555-3ee54c18ea51',
        viewFields: {
          type: {
            universalIdentifier: '689b4749-aa40-489a-bf0b-475a197ca2e6',
          },
          workflow: {
            universalIdentifier: 'e5a46195-06fe-4f47-8844-128e35151d37',
          },
          createdAt: {
            universalIdentifier: 'bb35e66a-2a1e-416b-8105-5749d91ab65f',
          },
        },
      },
      workflowAutomatedTriggerRecordPageFields: {
        universalIdentifier: '10aff295-f7ac-475d-8528-661eb9aa9759',
        viewFieldGroups: {
          general: {
            universalIdentifier: 'c5261eae-f2fe-416e-8ef9-eda5d377f8ca',
          },
          system: {
            universalIdentifier: 'e6da0410-7f63-41b7-b977-421fc37d67f5',
          },
        },
        viewFields: {
          type: {
            universalIdentifier: '3b3a0cf7-f171-4ad8-9aad-aed84eca0250',
          },
          workflow: {
            universalIdentifier: 'ddc5a9f6-f577-4e4b-a258-3d656c32babc',
          },
          createdAt: {
            universalIdentifier: '98ef45e8-c6bf-42e6-96f6-e94cd17911bc',
          },
          createdBy: {
            universalIdentifier: 'd3933427-de7f-4fa1-b80c-47302273d848',
          },
        },
      },
    },
  },
  workflowRun: {
    universalIdentifier: '20202020-4e28-4e95-a9d7-6c00874f843c',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-4e28-4e95-a9d7-6c00874f843c',
      ),
      name: { universalIdentifier: '20202020-b840-4253-aef9-4e5013694587' },
      workflowVersion: {
        universalIdentifier: '20202020-2f52-4ba8-8dc4-d0d6adb9578d',
      },
      workflow: {
        universalIdentifier: '20202020-8c57-4e7f-84f5-f373f68e1b82',
      },
      enqueuedAt: {
        universalIdentifier: '20202020-f1e3-4de1-a461-b5c4fdbc861d',
      },
      startedAt: {
        universalIdentifier: '20202020-a234-4e2d-bd15-85bcea6bb183',
      },
      endedAt: { universalIdentifier: '20202020-e1c1-4b6b-bbbd-b2beaf2e159e' },
      status: { universalIdentifier: '20202020-6b3e-4f9c-8c2b-2e5b8e6d6f3b' },
      state: { universalIdentifier: '20202020-611f-45f3-9cde-d64927e8ec57' },
      stepLogs: {
        universalIdentifier: '20202020-7c4e-4e1a-8fc1-1e3a55d6c2a1',
      },
      timelineActivities: {
        universalIdentifier: '20202020-af4d-4eb0-babc-eb960a45b356',
      },
    },
    indexes: {
      workflowVersionIdIndex: {
        universalIdentifier: '8183c8d2-9114-4b6e-8c5d-12a3b14a5a14',
      },
      workflowIdIndex: {
        universalIdentifier: '9294d9e3-0225-4c7f-9d6e-23b4c25b6b25',
      },
      searchVectorGinIndex: {
        universalIdentifier: 'e0ac5ad2-d0c8-4f72-b710-8e53b9dc18d9',
      },
    },
    views: {
      allWorkflowRuns: {
        universalIdentifier: '20202020-a011-4a11-8a11-a0bcf10abca5',
        viewFields: {
          name: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcaf',
          },
          workflow: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcb0',
          },
          status: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcb1',
          },
          startedAt: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcb2',
          },
          createdBy: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcb3',
          },
          workflowVersion: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcb4',
          },
        },
      },
      workflowRunRecordPageFields: {
        universalIdentifier: '20202020-a011-4a11-8a11-a0bcf10abcf1',
        viewFields: {
          status: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcf6',
          },
          workflow: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcf7',
          },
          workflowVersion: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcf8',
          },
          startedAt: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcf9',
          },
          endedAt: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcfa',
          },
          createdAt: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcfb',
          },
          createdBy: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcfc',
          },
          enqueuedAt: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abcfd',
          },
          state: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abd01',
          },
          updatedAt: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abd02',
          },
          updatedBy: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abd03',
          },
          timelineActivities: {
            universalIdentifier: '20202020-af11-4a11-8a11-a0bcf10abd05',
          },
        },
        viewFieldGroups: {
          general: {
            universalIdentifier: '20202020-a011-4a11-8a11-a0bcf10abcf2',
          },
          system: {
            universalIdentifier: '20202020-a011-4a11-8a11-a0bcf10abcf4',
          },
        },
      },
    },
  },
  workflowVersion: {
    universalIdentifier: '20202020-d65d-4ab9-9344-d77bfb376a3d',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-d65d-4ab9-9344-d77bfb376a3d',
      ),
      name: { universalIdentifier: '20202020-a12f-4cca-9937-a2e40cc65509' },
      workflow: {
        universalIdentifier: '20202020-afa3-46c3-91b0-0631ca6aa1c8',
      },
      trigger: {
        universalIdentifier: '20202020-4eae-43e7-86e0-212b41a30b48',
      },
      status: {
        universalIdentifier: '20202020-5a34-440e-8a25-39d8c3d1d4cf',
      },
      runs: { universalIdentifier: '20202020-1d08-46df-901a-85045f18099a' },
      steps: { universalIdentifier: '20202020-5988-4a64-b94a-1f9b7b989039' },
      timelineActivities: {
        universalIdentifier: '20202020-fcb0-4695-b17e-3b43a421c633',
      },
    },
    indexes: {
      workflowIdIndex: {
        universalIdentifier: '8138c3b3-0b14-4ee1-be0e-debdde6b3219',
      },
      searchVectorGinIndex: {
        universalIdentifier: '6f3a65eb-2aee-4108-b8a0-c62da419d1dc',
      },
    },
    views: {
      allWorkflowVersions: {
        universalIdentifier: '20202020-a010-4a10-8a10-a0bcf10aae15',
        viewFields: {
          name: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaeaf',
          },
          workflow: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaeb0',
          },
          status: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaeb1',
          },
          updatedAt: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaeb2',
          },
          runs: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaeb3',
          },
        },
      },
      workflowVersionRecordPageFields: {
        universalIdentifier: '20202020-a010-4a10-8a10-a0bcf10aaef1',
        viewFields: {
          status: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaef6',
          },
          workflow: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaef7',
          },
          trigger: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaef8',
          },
          createdAt: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaef9',
          },
          steps: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaefa',
          },
          createdBy: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaefb',
          },
          updatedAt: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaefc',
          },
          updatedBy: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaefd',
          },
          runs: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaefe',
          },
          timelineActivities: {
            universalIdentifier: '20202020-af10-4a10-8a10-a0bcf10aaf01',
          },
        },
        viewFieldGroups: {
          general: {
            universalIdentifier: '20202020-a010-4a10-8a10-a0bcf10aaef2',
          },
          system: {
            universalIdentifier: '20202020-a010-4a10-8a10-a0bcf10aaef4',
          },
        },
      },
    },
  },
  inboundEventLedger: {
    universalIdentifier: 'e5b9f029-6dfe-44e8-88b2-ae8ba5ec141a',
    fields: {
      ...buildStandardObjectSystemFields(
        'e5b9f029-6dfe-44e8-88b2-ae8ba5ec141a',
      ),
      eventId: {
        universalIdentifier: '38ae8bdc-9dc3-4e3c-b5bf-541a0d5c1107',
      },
      eventType: {
        universalIdentifier: '9574a671-09e5-4c8a-a0dc-a3bb100148b3',
      },
      idempotencyKey: {
        universalIdentifier: '069466e6-44b8-4b09-b80c-0e01756b6188',
      },
      sourceSystem: {
        universalIdentifier: '1a52d108-cd65-45eb-a604-2cb7d18e4a68',
      },
      sourceCollection: {
        universalIdentifier: 'e4a625db-c0e9-42a2-a14d-0d9d5ed8e6ab',
      },
      sourceRecordId: {
        universalIdentifier: '4afa8e3c-0df1-4443-9f77-4445ca3bc74a',
      },
      status: {
        universalIdentifier: '0e371906-2184-4438-b8d8-c31ef5afb56c',
      },
      payloadHash: {
        universalIdentifier: 'b5df41fa-0e08-47e4-abe4-bbcb8789ab64',
      },
      receivedAt: {
        universalIdentifier: 'f41df463-cd96-45ce-b210-c38906da9dd2',
      },
      processedAt: {
        universalIdentifier: 'c7411103-7d1f-4c13-9db3-4e264eaf6d49',
      },
      errorMessage: {
        universalIdentifier: '88b45c33-dd05-4326-b6c7-97f885b41120',
      },
    },
    indexes: {
      eventIdIndex: {
        universalIdentifier: '3c57b005-3963-4721-b085-886a75702515',
      },
      idempotencyKeyIndex: {
        universalIdentifier: '41d0cc81-f2db-4faa-8c55-76da8bafdb67',
      },
    },
  },
  outboundEventLedger: {
    universalIdentifier: '20a6174b-3ddf-4169-8f34-52fc117a0d2d',
    fields: {
      ...buildStandardObjectSystemFields(
        '20a6174b-3ddf-4169-8f34-52fc117a0d2d',
      ),
      eventId: {
        universalIdentifier: 'cfd782b2-418a-409c-8af1-b10c832d28b1',
      },
      eventType: {
        universalIdentifier: 'b03016ab-19a2-4612-a509-f585922ad24c',
      },
      targetCollection: {
        universalIdentifier: 'ea0da39a-f2c9-4d1e-8a10-0e74192335c1',
      },
      targetRecordId: {
        universalIdentifier: 'beed17b4-55e7-4b70-ab1e-a49019b7d0e0',
      },
      status: {
        universalIdentifier: '88e25855-76af-49f9-a3a5-3446fbf9f106',
      },
      beforeHash: {
        universalIdentifier: '2f36501a-12fe-44dd-89f3-9ddcb22670d3',
      },
      afterHash: {
        universalIdentifier: '8a384b19-e934-494e-bb74-2b57dee59ae7',
      },
      sentAt: {
        universalIdentifier: '2f56f23d-0da3-42e7-b75c-c862b9fe62db',
      },
      errorMessage: {
        universalIdentifier: 'b24ac577-169f-4531-a990-f30407fb14d8',
      },
    },
    indexes: {},
  },
  workspaceMember: {
    universalIdentifier: '20202020-3319-4234-a34c-82d5c0e881a6',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-3319-4234-a34c-82d5c0e881a6',
      ),
      name: { universalIdentifier: '20202020-e914-43a6-9c26-3603c59065f4' },
      colorScheme: {
        universalIdentifier: '20202020-66bc-47f2-adac-f2ef7c598b63',
      },
      locale: {
        universalIdentifier: '20202020-402e-4695-b169-794fa015afbe',
      },
      avatarUrl: {
        universalIdentifier: '20202020-0ced-4c4f-a376-c98a966af3f6',
      },
      userEmail: {
        universalIdentifier: '20202020-4c5f-4e09-bebc-9e624e21ecf4',
      },
      jobTitle: {
        universalIdentifier: '20202020-4dd4-4619-826e-08f6c06b374d',
      },
      userId: {
        universalIdentifier: '20202020-75a9-4dfc-bf25-2e4b43e89820',
      },
      assignedTasks: {
        universalIdentifier: '20202020-61dc-4a1c-99e8-38ebf8d2bbeb',
      },
      ownedOpportunities: {
        universalIdentifier: '20202020-9e4d-4b3a-8c1f-6d7e8f9a0b1c',
      },
      accountOwnerForCompanies: {
        universalIdentifier: '20202020-dc29-4bd4-a3c1-29eafa324bee',
      },
      messageParticipants: {
        universalIdentifier: '20202020-8f99-48bc-a5eb-edd33dd54188',
      },
      blocklist: {
        universalIdentifier: '20202020-6cb2-4161-9f29-a4b7f1283859',
      },
      calendarEventParticipants: {
        universalIdentifier: '20202020-0dbc-4841-9ce1-3e793b5b3512',
      },
      timelineActivities: {
        universalIdentifier: '20202020-e15b-47b8-94fe-8200e3c66615',
      },
      approvedSearchEngagementTerms: {
        universalIdentifier: '83697254-61a0-498b-9417-0095ef02cb0f',
      },
      assignmentTeamMemberships: {
        universalIdentifier: '16a57e97-d1c5-4c5f-8840-6949b1193d4b',
      },
      approvedPositionSpecifications: {
        universalIdentifier: 'b95fe474-8ff9-4081-be9c-082f82fd2fb4',
      },
      timeZone: {
        universalIdentifier: '20202020-2d33-4c21-a86e-5943b050dd54',
      },
      dateFormat: {
        universalIdentifier: '20202020-af13-4e11-b1e7-b8cf5ea13dc0',
      },
      timeFormat: {
        universalIdentifier: '20202020-8acb-4cf8-a851-a6ed443c8d81',
      },
      calendarStartDay: {
        universalIdentifier: '20202020-1ecc-4562-84c9-ff3a2f6cce85',
      },
      numberFormat: {
        universalIdentifier: '20202020-7f40-4e7f-b126-11c0eda6b141',
      },
      ownedSearchEngagementTerms: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8bc5',
      },
      ownedClientAccountProfiles: {
        universalIdentifier: '20202020-a1b2-4c3d-8e5f-6a7b8c9d0f02',
      },
      confidentialityRecords: {
        universalIdentifier: '20202020-c5d6-4071-2637-0c1d2e3f4a5b',
      },
    },
    indexes: {
      userEmailUniqueIndex: {
        universalIdentifier: '76da5f27-523c-44b6-ad06-12954f6b949f',
      },
      searchVectorGinIndex: {
        universalIdentifier: '8678dde9-a804-4a9e-80e3-9af35e471ec5',
      },
    },
    views: {
      allWorkspaceMembers: {
        universalIdentifier: '20202020-e001-4e01-8e01-a0bcaeabe100',
        viewFields: {
          name: {
            universalIdentifier: '20202020-ef01-4e01-8e01-a0bcaeabe1f0',
          },
          userEmail: {
            universalIdentifier: '20202020-ef01-4e01-8e01-a0bcaeabe1f1',
          },
          avatarUrl: {
            universalIdentifier: '20202020-ef01-4e01-8e01-a0bcaeabe1f2',
          },
          colorScheme: {
            universalIdentifier: '20202020-ef01-4e01-8e01-a0bcaeabe1f3',
          },
          locale: {
            universalIdentifier: '20202020-ef01-4e01-8e01-a0bcaeabe1f4',
          },
          timeZone: {
            universalIdentifier: '20202020-ef01-4e01-8e01-a0bcaeabe1f5',
          },
          dateFormat: {
            universalIdentifier: '20202020-ef01-4e01-8e01-a0bcaeabe1f6',
          },
          timeFormat: {
            universalIdentifier: '20202020-ef01-4e01-8e01-a0bcaeabe1f7',
          },
          createdAt: {
            universalIdentifier: '20202020-ef01-4e01-8e01-a0bcaeabe1f8',
          },
          ownedOpportunities: {
            universalIdentifier: '8a0503f3-ba61-453e-86dc-6c79f7bc235b',
          },
          assignedTasks: {
            universalIdentifier: 'af16226e-6375-4676-8bd9-9d1a57076fc4',
          },
        },
      },
    },
  },
  externalEntityLink: {
    universalIdentifier: '83a0c657-2e64-47c5-a363-bf7f23b5bb58',
    fields: {
      ...buildStandardObjectSystemFields(
        '83a0c657-2e64-47c5-a363-bf7f23b5bb58',
      ),
      system: {
        universalIdentifier: 'b0d3e716-8c84-4262-82c1-facad5b2bfb8',
      },
      externalCollection: {
        universalIdentifier: 'f09b8319-4cfd-4e49-af76-e6b83b894e0b',
      },
      externalId: {
        universalIdentifier: 'd4fd91bd-2ea6-4c10-ac78-9c2e0083a20c',
      },
      twentyObjectUniversalIdentifier: {
        universalIdentifier: '6252a551-04a6-4669-ab88-604076aeab92',
      },
      twentyRecordId: {
        universalIdentifier: '06974d24-f0e8-4ea5-b71c-3aca591a6b65',
      },
      externalNaturalKey: {
        universalIdentifier: '47388e8a-1fd2-4e16-bdc9-723f3e1d04dc',
      },
      sourceVersion: {
        universalIdentifier: '3a53950c-9516-4881-ac54-8d3ce89e5c7c',
      },
      location: {
        universalIdentifier: '07122700-58cc-457b-b636-a2dd9954e07e',
      },
      isBoardReady: {
        universalIdentifier: '673edebe-1dea-48d4-a642-f06fd3234a5b',
      },
      lastVerifiedAt: {
        universalIdentifier: 'eaeb12f5-f428-4984-b3d4-4a5aeae0b5e2',
      },
      careerExperiences: {
        universalIdentifier: '76ee9fcc-6b69-4d01-9d44-4840a8216635',
      },
      educations: {
        universalIdentifier: '2c17c5ac-2322-4b29-8233-0dd83dca9d15',
      },
      boardServices: {
        universalIdentifier: '22cd6643-8201-4191-8c96-bc24a82f3ea0',
      },
      capabilities: {
        universalIdentifier: '92bccc31-8902-4509-8e6f-6bbb8dc1c8d6',
      },
      languages: {
        universalIdentifier: '299da58e-831b-4dd1-bef3-22fa71df8c27',
      },
      artifacts: {
        universalIdentifier: 'b23b6349-5b86-485a-b906-8da0dbda0eb4',
      },
      awards: {
        universalIdentifier: '1f97517b-33e1-43cb-9b1c-8405558eae2d',
      },
      externalProfiles: {
        universalIdentifier: 'f933faa8-cfd7-43f9-ba41-85eb5e4d15fe',
      },
      searchPreferences: {
        universalIdentifier: 'e35d2471-a079-4318-b94e-b8485ff2896b',
      },
      researchCandidates: {
        universalIdentifier: 'd5d279c4-0001-4000-8000-000000000001',
      },
    },
    indexes: {
      personIdUniqueIndex: {
        universalIdentifier: '3c5cdcfb-e7da-4f5f-9541-aabea51d8e23',
      },
    },
  },
  workspaceEventOutbox: {
    universalIdentifier: '312e755f-c55a-447f-a664-6545b5b10db9',
    fields: {
      ...buildStandardObjectSystemFields(
        '312e755f-c55a-447f-a664-6545b5b10db9',
      ),
      eventName: {
        universalIdentifier: '25a2ebe6-79c5-437c-9c5a-2e1308ac8a4b',
      },
      eventPayload: {
        universalIdentifier: '15701d5b-ee6c-44cd-80c2-25c056a82f99',
      },
      idempotencyKey: {
        universalIdentifier: '6d71bc55-7745-4485-95f4-634174797499',
      },
      status: {
        universalIdentifier: 'ee5087da-cfb3-4787-895e-e191568925dc',
      },
      attemptCount: {
        universalIdentifier: 'd2e9b6b7-9d92-4dfa-92e4-d6e377d549dc',
      },
      lastAttemptAt: {
        universalIdentifier: 'f81b6a87-f1fe-4b4e-b631-b11e4bfc61f3',
      },
      nextAttemptAt: {
        universalIdentifier: 'ee3d5c0f-aca3-41ab-aee4-587e6fd762e0',
      },
      lastErrorMessage: {
        universalIdentifier: 'd61593c3-de6f-4ca6-9ecc-b610c4e4d325',
      },
      deliveredAt: {
        universalIdentifier: 'af1ecc2b-7fae-4a8d-894d-5087dc80cd01',
      },
    },
    indexes: {
      statusIndex: {
        universalIdentifier: '1161129a-819c-442b-b0a3-b0a3fff694d6',
      },
    },
    views: {
      allWorkspaceEventOutboxes: {
        universalIdentifier: '501a6d8b-87f8-463b-b2f3-f34f44620c73',
        viewFields: {
          eventName: {
            universalIdentifier: 'd461ec80-04b2-4389-871f-ade5faca2eb1',
          },
          eventPayload: {
            universalIdentifier: 'a0b2d849-47b4-437c-8bc7-6d021707125c',
          },
          status: {
            universalIdentifier: '69b8daed-7fcc-4271-80c8-611b82f13e4e',
          },
        },
      },
    },
  },
  executiveProfile: {
    universalIdentifier: 'c074d37e-857d-4a77-a1fa-dabbd088bb2d',
    fields: {
      ...buildStandardObjectSystemFields(
        'c074d37e-857d-4a77-a1fa-dabbd088bb2d',
      ),
      person: {
        universalIdentifier: 'fcdb1e4d-df64-4f08-b474-64f305f195f9',
      },
      headline: {
        universalIdentifier: '5e195816-4d09-4e84-9c6c-1a0859e98ebc',
      },
      summary: {
        universalIdentifier: 'aa325eaa-8eb1-490b-9c32-c7158e67d1ec',
      },
      currentCompany: {
        universalIdentifier: '62f5a0e1-43b1-4e73-8c9a-c399c7f85890',
      },
      location: {
        universalIdentifier: '465bf4ab-f518-4ed0-91e5-467a6a283a8d',
      },
      yearsOfExperience: {
        universalIdentifier: 'de83e3c1-463b-4265-97bb-e5a092905b59',
      },
      availabilityStatus: {
        universalIdentifier: '202a1c8d-8cd5-4eb2-9afc-981c7dc80bce',
      },
      profileVisibility: {
        universalIdentifier: '00e79e74-285c-42dd-979b-202c05b64b11',
      },
      isBoardReady: {
        universalIdentifier: 'b7cfe9d7-7aa7-4d5f-8bb7-54ea66599dd5',
      },
      sourceSystem: {
        universalIdentifier: 'a913a578-9df0-4872-92f8-6ed46d94ee95',
      },
      sourceRecordId: {
        universalIdentifier: 'f899bdf6-dc96-4fa5-8b78-0e9a3559f484',
      },
      sourceUpdatedAt: {
        universalIdentifier: '58e5092c-af5d-4e61-89ea-de653b4df41f',
      },
      sourceHash: {
        universalIdentifier: 'ae9e5834-10ec-45ea-a1f4-2f16429ecc7b',
      },
      candidacies: {
        universalIdentifier: 'c074d37e-9001-4a77-a1fa-dabbd088b001',
      },
    },
    indexes: {
      personIdIndex: {
        universalIdentifier: 'efe53369-4236-485c-8f03-5d99a9847a9b',
      },
    },
    views: {
      allExecutiveProfiles: {
        universalIdentifier: 'e09017b3-24e7-4357-b9fd-75c6a667e629',
        viewFields: {
          person: {
            universalIdentifier: 'adfc5552-d5d1-4467-b776-e291a9d08e8c',
          },
          headline: {
            universalIdentifier: '3c180e89-d829-4ca8-b2cc-b528288005e5',
          },
          currentTitle: {
            universalIdentifier: 'e03cdb9b-3dd9-4eb1-b1fe-b5a37e50ea91',
          },
          profileStatus: {
            universalIdentifier: '832602cc-eb2b-4903-8122-e2b3ad347022',
          },
        },
      },
    },
  },
  executiveCareerExperience: {
    universalIdentifier: '190293c9-19bb-4bce-a532-90f82606cee0',
    fields: {
      ...buildStandardObjectSystemFields(
        '190293c9-19bb-4bce-a532-90f82606cee0',
      ),
      executiveProfile: {
        universalIdentifier: '9efacd73-d743-48a9-84da-e97276f20cb9',
      },
      company: {
        universalIdentifier: 'e24afe6c-4bfe-4cf4-9b1c-37cdc56b4a19',
      },
      title: {
        universalIdentifier: '306064f8-dfd4-4219-8f11-8892b799e071',
      },
      startDate: {
        universalIdentifier: '08e6a087-f6b5-4d4d-b90e-7ea1aacee6bd',
      },
      endDate: {
        universalIdentifier: '069d770c-107e-44a3-8872-9685a1ff5551',
      },
      isCurrent: {
        universalIdentifier: 'd8c6bc27-51ef-48ea-b42a-4eaf00ffe33c',
      },
      employmentType: {
        universalIdentifier: '7bf85b9d-1aa0-4ad7-8bdd-aa8d8dc2a5ed',
      },
      industry: {
        universalIdentifier: '2dce0754-1284-4a03-96a6-e3afe847406b',
      },
      description: {
        universalIdentifier: 'ec5a8a01-fa23-4776-bff4-0d435f375a4c',
      },
    },
    indexes: {
      executiveProfileIdIndex: {
        universalIdentifier: 'ef6c772c-a320-4fa3-9ee0-1cbbd0a83a74',
      },
    },
    views: {
      allExecutiveCareerExperiences: {
        universalIdentifier: '04f0c494-770a-41e2-8eec-2fa6f7d16758',
        viewFields: {
          executiveProfile: {
            universalIdentifier: 'a4e32275-7e73-4d62-997e-fa9abc6a37e1',
          },
          company: {
            universalIdentifier: 'f06502a3-970c-4be1-8dca-d18bf92cd6c9',
          },
          title: {
            universalIdentifier: '1eb36b0d-8436-4762-9a22-aee0d43ecbda',
          },
        },
      },
    },
  },
  executiveEducation: {
    universalIdentifier: 'bf6030cd-7ce5-4c11-bf81-974ff65fd4b1',
    fields: {
      ...buildStandardObjectSystemFields(
        'bf6030cd-7ce5-4c11-bf81-974ff65fd4b1',
      ),
      executiveProfile: {
        universalIdentifier: '46116daf-edea-4322-9345-cdee35f510ff',
      },
      institution: {
        universalIdentifier: 'f645863d-a183-4673-afca-3ba6144c8d54',
      },
      degree: {
        universalIdentifier: 'b2dfb62b-f70f-4495-9c77-e29358a2ba1f',
      },
      fieldOfStudy: {
        universalIdentifier: 'e767fd53-15d3-4cf4-ab4e-41e97310ac59',
      },
      startDate: {
        universalIdentifier: 'b6b86738-823f-453b-9ece-82eb8a5b883d',
      },
      endDate: {
        universalIdentifier: '5044787f-2fbb-4728-8d9f-2bcc4d1a2533',
      },
      isVerified: {
        universalIdentifier: 'fd68a310-30c3-438f-93ec-2f67e4bd4ebf',
      },
    },
    indexes: {
      executiveProfileIdIndex: {
        universalIdentifier: '28619741-dc44-4f9a-a904-4218a42ce88b',
      },
    },
    views: {
      allExecutiveEducations: {
        universalIdentifier: '8c87d34f-505a-49ce-b41b-384e867abbad',
        viewFields: {
          executiveProfile: {
            universalIdentifier: 'a692477d-11c9-4249-baab-8b6ae51427c5',
          },
          institution: {
            universalIdentifier: '146ccaee-632f-4246-95f2-d15577308fe5',
          },
          degree: {
            universalIdentifier: '358327d9-0dd2-4ad9-858d-679b1b04f494',
          },
        },
      },
    },
  },
  executiveBoardService: {
    universalIdentifier: '30b0287e-6681-42c1-94f9-01ed0e06055b',
    fields: {
      ...buildStandardObjectSystemFields(
        '30b0287e-6681-42c1-94f9-01ed0e06055b',
      ),
      executiveProfile: {
        universalIdentifier: '5b9adcdc-f3f8-408f-87d1-e3a956f42753',
      },
      companyName: {
        universalIdentifier: '29a5dda7-0715-46e3-bfac-a48eb94d827c',
      },
      ticker: {
        universalIdentifier: '68714b8e-8761-482d-9098-33b337a7db5c',
      },
      role: {
        universalIdentifier: 'bc3710d9-2ec9-49e5-b733-05074e950c59',
      },
      boardType: {
        universalIdentifier: '166c1941-3794-43b4-9a1a-c45dc255eb72',
      },
      startDate: {
        universalIdentifier: 'ae77d8e0-687d-460b-a550-4985ed909d03',
      },
      endDate: {
        universalIdentifier: '971dc7ff-fcb8-48d2-88b9-06d2b53fe006',
      },
      isCurrent: {
        universalIdentifier: 'e2c0271c-4d40-4c6d-ab88-c0556b227c0a',
      },
      isIndependent: {
        universalIdentifier: '5ef4af17-6173-48f1-9f3d-6013e8e4b922',
      },
      committees: {
        universalIdentifier: '7cbd9927-e8f2-444d-9456-6a72834c45a1',
      },
    },
    indexes: {
      executiveProfileIdIndex: {
        universalIdentifier: 'ab023ed9-c408-4d1e-bf4a-9eb287755171',
      },
    },
    views: {
      allExecutiveBoardServices: {
        universalIdentifier: 'ec96a0b0-64bc-4689-adfe-b7ea488b938f',
        viewFields: {
          executiveProfile: {
            universalIdentifier: '7c991eea-6038-4718-8286-b9a1ce1f5bb9',
          },
          companyName: {
            universalIdentifier: '598d41ec-c6d5-40a1-a582-5b5f49d2c9d2',
          },
          role: {
            universalIdentifier: '983b0f7a-8ccc-45ea-a0f8-ac9869d7a5bb',
          },
        },
      },
    },
  },
  executiveCapability: {
    universalIdentifier: '6dd2cb7c-9c30-47ed-bfb6-c8ccb33baaea',
    fields: {
      ...buildStandardObjectSystemFields(
        '6dd2cb7c-9c30-47ed-bfb6-c8ccb33baaea',
      ),
      executiveProfile: {
        universalIdentifier: 'fbadff04-0f83-47d0-a9e7-9e8d334482e3',
      },
      name: {
        universalIdentifier: 'f6d5419b-d9e9-4913-aac4-2d763a6c8eba',
      },
      category: {
        universalIdentifier: 'fafe342c-45d7-4562-8978-6cbf40147a41',
      },
      proficiencyLevel: {
        universalIdentifier: '039a7e32-b6c9-4a41-870a-6149ef814d90',
      },
      source: {
        universalIdentifier: 'be81885f-786d-44f9-a404-1342f8b915b0',
      },
    },
    indexes: {
      executiveProfileIdIndex: {
        universalIdentifier: '946586fa-0d98-4870-9815-03a7e34182cf',
      },
    },
    views: {
      allExecutiveCapabilities: {
        universalIdentifier: 'f7b0e940-2471-43bc-9739-74ebb9f5d76b',
        viewFields: {
          executiveProfile: {
            universalIdentifier: '3789380b-47b9-4b07-89c8-5c45e7d4aacb',
          },
          name: {
            universalIdentifier: '936cd406-0bde-4bc3-97be-f437a787ef52',
          },
          category: {
            universalIdentifier: '9241cdd6-642d-4612-9c16-27aaa20606ff',
          },
        },
      },
    },
  },
  executiveLanguage: {
    universalIdentifier: '2c749e10-ae76-4d9e-bed1-46630b4bf65e',
    fields: {
      ...buildStandardObjectSystemFields(
        '2c749e10-ae76-4d9e-bed1-46630b4bf65e',
      ),
      executiveProfile: {
        universalIdentifier: 'b174ae1d-19fc-40f3-968b-616851622994',
      },
      language: {
        universalIdentifier: '033dfeb3-39af-4d28-9fd4-0dd738a351e8',
      },
      proficiency: {
        universalIdentifier: 'cf837ab1-3830-4272-b81b-8786a2c44d10',
      },
    },
    indexes: {
      executiveProfileIdIndex: {
        universalIdentifier: '45c6f684-2970-4bd5-8d47-7c552769d3f9',
      },
    },
    views: {
      allExecutiveLanguages: {
        universalIdentifier: '604f6e84-cb7d-4832-9c1a-d4541ccc4a1a',
        viewFields: {
          executiveProfile: {
            universalIdentifier: '712eae75-b19a-4cfc-a90e-96c5c3065c44',
          },
          language: {
            universalIdentifier: 'e9b50eeb-df54-4594-bcbd-396d836dee9d',
          },
          proficiency: {
            universalIdentifier: '2b6280c5-178d-48be-ad74-1706eb2e47d0',
          },
        },
      },
    },
  },
  confidentialityRecord: {
    universalIdentifier: '526d8232-bccb-42df-b5b6-e3a143dba557',
    fields: {
      ...buildStandardObjectSystemFields(
        '526d8232-bccb-42df-b5b6-e3a143dba557',
      ),
      searchAssignmentId: {
        universalIdentifier: '70658dbd-dbde-4136-8444-29d6bd336e44',
      },
      company: {
        universalIdentifier: '45d76ef3-2d08-4124-aca2-18e7a4eec83c',
      },
      person: {
        universalIdentifier: 'f8f15951-b93c-47ae-b957-5ec14145dbb4',
      },
      summary: {
        universalIdentifier: '63e542e3-a2d6-4f46-b407-000975983b6d',
      },
      recordType: {
        universalIdentifier: '07e7a835-6016-4a02-81d4-0850b316238d',
      },
      status: {
        universalIdentifier: '43f250d1-f809-493b-b99f-a1e07d0175ca',
      },
      counterpartyName: {
        universalIdentifier: 'f65d12b4-8d20-4483-9537-d86cb1961399',
      },
      signedDate: {
        universalIdentifier: '06034fa6-ba53-4c8c-b4f3-b3c188aaa8e9',
      },
      expiryDate: {
        universalIdentifier: 'cc9b8130-792f-4d18-8991-51cbe5e977e2',
      },
      scope: {
        universalIdentifier: 'e549cca0-6442-4662-bbf3-94a0748074c9',
      },
      notes: {
        universalIdentifier: '4abda535-d226-4fe8-9ad9-f0c8a7c58786',
      },
      owner: {
        universalIdentifier: 'baad4a5f-db62-461a-b154-859c33b80f1a',
      },
    },
    indexes: {},
    views: {
      allConfidentialityRecords: {
        universalIdentifier: 'ab72df25-dd02-4ff3-82a8-10f8c4a76f47',
        viewFields: {
          summary: {
            universalIdentifier: 'b3552a5c-fba1-49f4-bfe3-5ce432c342a7',
          },
          recordType: {
            universalIdentifier: '72c91f61-9c29-4044-b3b4-57d436431714',
          },
          status: {
            universalIdentifier: '5f0f5fd5-dc50-4bd3-b29b-e6784c87dd64',
          },
          counterpartyName: {
            universalIdentifier: '790a2434-70e5-422c-9912-05fb1576b163',
          },
          owner: {
            universalIdentifier: '19e2f529-df91-42ff-8f79-04eab31879ea',
          },
        },
      },
    },
  },
  conflictCheck: {
    universalIdentifier: '84e9dfc7-cabe-47c9-915b-0c8a21dd0c7f',
    fields: {
      ...buildStandardObjectSystemFields(
        '84e9dfc7-cabe-47c9-915b-0c8a21dd0c7f',
      ),
      searchAssignmentId: {
        universalIdentifier: 'b52568ab-ab31-45c2-92ea-81b13495c444',
      },
      subjectPerson: {
        universalIdentifier: '9dd4ad90-9600-4233-9c2f-6c23f84c4f12',
      },
      subjectCompany: {
        universalIdentifier: '1fb44de1-cdac-4f9a-baa1-aba7b4e22ef9',
      },
      matchedRestriction: {
        universalIdentifier: 'd7fa2385-9a16-48f7-879e-25deb7a7ff70',
      },
      summary: {
        universalIdentifier: '399aa45e-5ebc-4b12-b1c3-c71287eef125',
      },
      subjectType: {
        universalIdentifier: '1e1a55f9-07ad-4682-a214-68042575bdb1',
      },
      checkType: {
        universalIdentifier: 'e42843f0-fe2e-44a0-892f-8689f1635c45',
      },
      outcome: {
        universalIdentifier: 'a9475649-f50b-44f6-9808-696e2efb7436',
      },
      outcomeReason: {
        universalIdentifier: '1d65366f-8947-4242-89fd-02b6a53cf6c9',
      },
      checkedAt: {
        universalIdentifier: 'd9db97e7-92f7-46e7-9a06-7b2dc105724a',
      },
      expiresAt: {
        universalIdentifier: '3cad0230-bfd9-4aa5-94ea-77bda38d9bb2',
      },
      waiverReference: {
        universalIdentifier: '6184a4d7-c8d9-4772-997e-5bd75e646209',
      },
      reviewNotes: {
        universalIdentifier: '51d6ea73-fd80-4c6c-b389-f50a88cdb19e',
      },
    },
    indexes: {},
    views: {
      allConflictChecks: {
        universalIdentifier: 'b45c8817-f605-49dc-8756-c0f1191b7d5e',
        viewFields: {
          summary: {
            universalIdentifier: '767b84f6-bd3f-41c2-a6aa-30ea7abcbdf1',
          },
          subjectType: {
            universalIdentifier: '5f85129d-b01f-4d47-96ad-c3de51b929b5',
          },
          checkType: {
            universalIdentifier: '83bfbaf7-d20f-449c-aca8-fa0302c3f88f',
          },
          outcome: {
            universalIdentifier: '4c7fa205-c6fd-4d94-9ab0-7212c57ba2b1',
          },
          outcomeReason: {
            universalIdentifier: 'c699f385-ab67-4dc5-ae6f-89b98dd61cf9',
          },
        },
      },
    },
  },
  executiveArtifact: {
    universalIdentifier: '46f80f0a-d4b6-4bb8-92bc-4e5e30dbf999',
    fields: {
      ...buildStandardObjectSystemFields(
        '46f80f0a-d4b6-4bb8-92bc-4e5e30dbf999',
      ),
      executiveProfile: {
        universalIdentifier: '12302a27-5ddb-48c1-8297-759a3c6a48cf',
      },
      type: {
        universalIdentifier: '3bf98426-7497-4b15-8bf2-dec2556e943a',
      },
      title: {
        universalIdentifier: 'e9992628-3d9b-46f5-bc55-17425800d010',
      },
      description: {
        universalIdentifier: 'f2114eb5-64c3-47e2-a9c2-5b205a765eea',
      },
      file: {
        universalIdentifier: '20bbf584-5eaa-457f-b4fc-790fec2fa868',
      },
      externalUrl: {
        universalIdentifier: '850c74b8-c272-4229-86ba-cf0ac022a814',
      },
      sourceHash: {
        universalIdentifier: 'bf5eb252-9b0f-4499-a1bc-ccc50dce677e',
      },
      version: {
        universalIdentifier: 'e1dbd025-3cc5-4532-b2e6-8c3546827529',
      },
      visibility: {
        universalIdentifier: '7da8bbd3-d1fb-4f76-9c0d-76d7264e6a60',
      },
      sourceUpdatedAt: {
        universalIdentifier: '383f2a5b-267b-44c2-bf50-b52bd3d49a83',
      },
      lastInboundSyncAt: {
        universalIdentifier: '881db3ab-9dae-46e6-b1c8-3dc60f25c29e',
      },
      lastOutboundSyncAt: {
        universalIdentifier: '3e7e4f11-d34e-4977-beee-7f16aefdb58d',
      },
      syncStatus: {
        universalIdentifier: '1a6b68dc-90c8-4bd5-b275-f005a99de7fa',
      },
      conflictStatus: {
        universalIdentifier: 'a02c861a-0686-4d92-b3fb-de2000b0e377',
      },
      lastErrorCode: {
        universalIdentifier: '2a161c81-84be-4c1f-957d-e0dbbd3eb0fe',
      },
      lastErrorAt: {
        universalIdentifier: '5f048077-3ccd-476c-9ce4-17a9cbcd0296',
      },
      isAuthoritativeLink: {
        universalIdentifier: '7a4efc36-4e82-4e3c-9cc1-83498f44d448',
      },
      metadata: {
        universalIdentifier: 'ea4943c8-d856-4da3-92af-e66bf139504d',
      },
    },
    indexes: {
      systemExternalCollectionExternalIdIndex: {
        universalIdentifier: '34097f88-2524-421d-85c8-dff16c0c63de',
      },
      systemTwentyObjectUniversalIdentifierTwentyRecordIdIndex: {
        universalIdentifier: '921b0777-f13f-468c-bebb-a35f6e41ab1a',
      },
    },
  },
  externalSyncOutbox: {
    universalIdentifier: '4b9c0a9e-a701-5ed2-81cf-3b3b93fb52b4',
    fields: {
      ...buildStandardObjectSystemFields(
        '4b9c0a9e-a701-5ed2-81cf-3b3b93fb52b4',
      ),
      workspaceId: {
        universalIdentifier: '88507694-7ded-50a5-9760-206a6ae1e251',
      },
      eventId: {
        universalIdentifier: '8a41378d-81c9-58c6-90ff-45df9742e42c',
      },
      domainIdempotencyKey: {
        universalIdentifier: '363a7fa3-a1e6-5fdc-a3e5-3693c92f23ef',
      },
      eventType: {
        universalIdentifier: '3df6b980-c8da-502a-9f77-48f1af9e6ea3',
      },
      entityName: {
        universalIdentifier: '4da335bf-a278-595a-8d49-b4483cf718a3',
      },
      entityId: {
        universalIdentifier: 'acf2e4cf-6b60-5643-a91e-7d9cf536533f',
      },
      payload: {
        universalIdentifier: '967b3dd2-f63d-518b-970d-26cfeb74fb05',
      },
      status: {
        universalIdentifier: 'b8ced3ac-2125-5052-997c-68b432f59026',
      },
      retryCount: {
        universalIdentifier: '97e988e1-1018-5f16-8fdd-57bead11af54',
      },
      maxRetries: {
        universalIdentifier: '6d14a977-51f4-54fd-bd54-c58a7781e69b',
      },
      lastError: {
        universalIdentifier: '55a13084-6166-5861-b5d7-c4e2d57dc81c',
      },
      nextRetryAt: {
        universalIdentifier: '7cb5b492-03fb-59aa-93c5-0aba9adcaa49',
      },
    },
    indexes: {
      eventIdUniqueIndex: {
        universalIdentifier: 'd6353a88-f364-5848-ad3c-7a8380cfcc47',
      },
      statusNextRetryIndex: {
        universalIdentifier: 'c91cd01a-3600-5ee1-8c51-8b8e10f27bac',
      },
      domainIdempotencyKeyUniqueIndex: {
        universalIdentifier: 'd90db8cc-927b-59d9-a54a-6024159a221b',
      },
    },
  },
  externalSyncInbox: {
    universalIdentifier: 'f24a4ec0-7f54-5cf4-bef4-72f7503f008d',
    fields: {
      ...buildStandardObjectSystemFields(
        'f24a4ec0-7f54-5cf4-bef4-72f7503f008d',
      ),
      workspaceId: {
        universalIdentifier: '57eb6bb8-192e-526f-a7f0-67b85bd84593',
      },
      externalEventId: {
        universalIdentifier: 'a746aa13-f23d-51ed-ad44-832f470e4d01',
      },
      externalSystemName: {
        universalIdentifier: '69cc7ae3-e32a-5e1e-b3f1-16d93d1cacc0',
      },
      eventType: {
        universalIdentifier: 'a0bbb151-83bf-50c8-a26d-6df4686f55f1',
      },
      entityName: {
        universalIdentifier: '8377e954-3553-526a-b238-fc99f519e3f2',
      },
      entityId: {
        universalIdentifier: 'ecffae49-90fb-5f21-b218-268b3dca3792',
      },
      payload: {
        universalIdentifier: '67550dd3-43e2-5328-9213-2ff5053404f8',
      },
      status: {
        universalIdentifier: '2fb7ddbc-6fa7-51f7-ad76-cd71bf2adc83',
      },
      processedAt: {
        universalIdentifier: 'e70387cf-87f8-567f-b703-1d19c15ab01d',
      },
      error: {
        universalIdentifier: '3ccb225d-d7cc-5900-9012-200cfbf5adaf',
      },
    },
    indexes: {
      externalEventIdUniqueIndex: {
        universalIdentifier: '929c3e31-be0e-58f1-b8c3-0378dae98026',
      },
    },
  },
  externalSyncDLQ: {
    universalIdentifier: '5de649b2-e6d0-5d69-a495-e1868f9be148',
    fields: {
      ...buildStandardObjectSystemFields(
        '5de649b2-e6d0-5d69-a495-e1868f9be148',
      ),
      workspaceId: {
        universalIdentifier: 'c2041ea2-0c93-5f95-970e-669639c2942e',
      },
      sourceType: {
        universalIdentifier: 'a8038a8c-aa77-5268-b904-a99411668ff4',
      },
      sourceRecordId: {
        universalIdentifier: 'f979b391-563b-5b8f-bf2b-fbf28a4e1bcd',
      },
      eventId: {
        universalIdentifier: '2ed44e7d-c1f9-5ebf-be22-4c99764da1b6',
      },
      eventType: {
        universalIdentifier: '70363e45-14a9-52f6-8475-4aead2178a0f',
      },
      payload: {
        universalIdentifier: '478fed7f-b44f-53d6-ab5e-020fdfb45ab7',
      },
      error: {
        universalIdentifier: '56e485c0-ca09-5a15-9e38-6aebed9b73f0',
      },
      errorClass: {
        universalIdentifier: '4b536ad0-079a-50f0-8105-99dd378078dd',
      },
      failedAt: {
        universalIdentifier: 'f1e71e93-ff59-5883-8774-b561d51723b4',
      },
    },
    indexes: {},
  },
  externalSyncCheckpoint: {
    universalIdentifier: '7ceba588-602a-579a-afb8-d93daaec7951',
    fields: {
      ...buildStandardObjectSystemFields(
        '7ceba588-602a-579a-afb8-d93daaec7951',
      ),
      workspaceId: {
        universalIdentifier: 'ef9e261c-3d10-51af-9570-dc952716213f',
      },
      externalSystemName: {
        universalIdentifier: '2460a0ca-e246-532b-ab5d-5db3c72bb249',
      },
      entityName: {
        universalIdentifier: '843d63a9-c33a-57c5-8099-84f754777b01',
      },
      lastExternalEventId: {
        universalIdentifier: 'f8b9b8ba-e566-52f8-b29c-a41297413e72',
      },
      lastExternalEventTimestamp: {
        universalIdentifier: 'bb367e7a-9d3c-5c9f-95b4-0ee90f2eb1f9',
      },
      lastSyncStartedAt: {
        universalIdentifier: '77240574-82eb-5a9c-9685-737f277a2596',
      },
      lastSyncCompletedAt: {
        universalIdentifier: '5a0c4789-2c25-5577-ae1a-9a7c4f87e9fb',
      },
      status: {
        universalIdentifier: '01d0dff1-3134-55f5-9ad9-e4f6e80db032',
      },
    },
    indexes: {
      workspaceSystemEntityUniqueIndex: {
        universalIdentifier: '4072b4fc-1240-5051-883c-421531562aab',
      },
    },
  },
  externalSyncReconciliation: {
    universalIdentifier: 'ab5eb338-796f-5ca3-b5ac-dd46cbfbd649',
    fields: {
      ...buildStandardObjectSystemFields(
        'ab5eb338-796f-5ca3-b5ac-dd46cbfbd649',
      ),
      workspaceId: {
        universalIdentifier: '02955e9b-b765-5d0d-a622-756470e90a6e',
      },
      externalSystemName: {
        universalIdentifier: 'a7515f32-6bcb-532b-ad89-0d4e461ebc4a',
      },
      entityName: {
        universalIdentifier: '563bcff6-68cc-5805-b6ae-9f9cdebf75fd',
      },
      startedAt: {
        universalIdentifier: '1381d520-f2f5-52e3-86af-9a3dd81bf86d',
      },
      completedAt: {
        universalIdentifier: 'f2d2f365-2a9f-55d5-b38d-2c926ee2939e',
      },
      status: {
        universalIdentifier: 'fcac52ec-d0d4-5a06-b295-eb8cf830ec7d',
      },
      totalCompared: {
        universalIdentifier: '94473693-905f-5a36-880c-fb81dd25bb9d',
      },
      matched: {
        universalIdentifier: 'af9b78f7-90b7-5fbe-9bba-d1bcf35424f2',
      },
      onlyInTwenty: {
        universalIdentifier: '173a940c-6202-5623-aa96-b98061cf8acd',
      },
      onlyInExternal: {
        universalIdentifier: '0bdf2f1b-1f07-5e24-86ad-2c3149c51d3a',
      },
      differenceCount: {
        universalIdentifier: '82201e4e-363a-55dc-a73e-c83056fc1c78',
      },
      findings: {
        universalIdentifier: '3cce1a4a-b44c-5f8e-b201-947bd031f812',
      },
    },
    indexes: {},
  },
  researchCandidate: {
    universalIdentifier: '414f051b-9f66-474f-b12f-d4ce8be498d3',
    fields: {
      ...buildStandardObjectSystemFields(
        '414f051b-9f66-474f-b12f-d4ce8be498d3',
      ),
      researchStrategy: {
        universalIdentifier: '9ae79ffa-4c24-435e-8ded-3a34204e6c81',
      },
      targetCompany: {
        universalIdentifier: '541eca59-4c94-406b-8167-53aae2acc56d',
      },
      executiveProfile: {
        universalIdentifier: '4c232326-a85e-4c61-808f-9fa06263b9fb',
      },
      person: {
        universalIdentifier: 'f45eb156-0e12-4025-8a24-4aba60204a78',
      },
      searchAssignmentId: {
        universalIdentifier: 'b5af2a6e-c02d-44cc-9637-6acc9b367407',
      },
      currentTitle: {
        universalIdentifier: '37b8f939-bfb4-4438-98fc-539d706d9458',
      },
      currentCompany: {
        universalIdentifier: '72b63657-11b9-417a-bfae-1c8be2505fbe',
      },
      fitScore: {
        universalIdentifier: '405b3f4b-887f-4fc2-9d55-5228707dc7c0',
      },
      tier: {
        universalIdentifier: 'c780b3cc-76e7-4a7a-8352-18fa9156490a',
      },
      status: {
        universalIdentifier: 'ea6b4c5d-4acd-432a-8c7e-af542639a78d',
      },
      source: {
        universalIdentifier: 'beae2eaf-1055-403e-b823-8a0c1674e984',
      },
      rationale: {
        universalIdentifier: '64cfc0c3-5856-4269-b207-145a0506de78',
      },
      notes: {
        universalIdentifier: '50cc1a60-e67b-4b8a-ba3c-6d32952e8138',
      },
      lastContactedAt: {
        universalIdentifier: '376925d4-fede-43be-a8ad-4d0151074651',
      },
      candidacies: {
        universalIdentifier: '414f051b-9001-474f-b12f-d4ce8be49901',
      },
    },
    indexes: {},
    views: {
      allResearchCandidates: {
        universalIdentifier: '76fb0935-2348-48ce-9638-bd3926d3bd10',
        viewFields: {
          researchStrategy: {
            universalIdentifier: '1ae4f071-5a81-4b13-bbb8-b0591ad71e60',
          },
          targetCompany: {
            universalIdentifier: '3d875823-d98b-4e57-9d75-b97a9cfa3258',
          },
          executiveProfile: {
            universalIdentifier: '2290c7a6-dc3e-4474-9af8-6c60258e3c61',
          },
          person: {
            universalIdentifier: '1e5614ad-2b81-47e6-841e-9ff4c76827cc',
          },
          searchAssignmentId: {
            universalIdentifier: '38c5fbc6-c765-4a71-bf4a-b5909b927b8c',
          },
          currentTitle: {
            universalIdentifier: 'f5b58d64-0a6f-4083-9e23-85db7eace72e',
          },
          currentCompany: {
            universalIdentifier: '4fc54335-bb9d-40bd-81f0-cd6671d369df',
          },
          fitScore: {
            universalIdentifier: 'e78a9335-bce5-4044-86fb-6fa0798618a2',
          },
          tier: {
            universalIdentifier: '3ae8baa0-20a8-4548-ad0a-62a5d9c38df2',
          },
          status: {
            universalIdentifier: '146574e9-cede-4f64-9dc5-3a9a65d3af0d',
          },
          source: {
            universalIdentifier: '497802f4-d7b4-4428-b3cc-ce69608d6fc8',
          },
          rationale: {
            universalIdentifier: '29bfbfb3-f646-4288-a1cb-3e4d57b11c1a',
          },
          notes: {
            universalIdentifier: 'ed6a9a49-c092-4b85-883b-b31899575ca5',
          },
          lastContactedAt: {
            universalIdentifier: '7da07a59-9554-4537-a594-9ee494ada022',
          },
        },
      },
    },
  },
  researchStrategy: {
    universalIdentifier: '39b454ce-1c6f-4312-a003-43a82f19955a',
    fields: {
      ...buildStandardObjectSystemFields(
        '39b454ce-1c6f-4312-a003-43a82f19955a',
      ),
      searchAssignmentId: {
        universalIdentifier: '219b26ca-c66d-435e-8fb7-db587e3fa3d0',
      },
      name: {
        universalIdentifier: 'cc442be1-b492-41af-9db4-202da6583fda',
      },
      status: {
        universalIdentifier: '44dbfe0d-02ee-4725-bab8-077b2ad48a2c',
      },
      priority: {
        universalIdentifier: 'e109dfa7-42c6-4910-887f-b9017b697ced',
      },
      objectives: {
        universalIdentifier: '229ad6e3-1ce7-4240-ad47-4ba86eea2f3d',
      },
      targetSegments: {
        universalIdentifier: '6c8bdd13-d0e4-42d7-b975-ada12ddc9577',
      },
      sourcingChannels: {
        universalIdentifier: '3f3bf409-91eb-4510-9522-c46a5c79c796',
      },
      targetCandidateCount: {
        universalIdentifier: 'a499b9ca-8424-4e7e-a7eb-826bfb6322d5',
      },
      startDate: {
        universalIdentifier: '004a896f-fbed-4c82-86e5-5d78d1f121f0',
      },
      targetCompletionDate: {
        universalIdentifier: 'c97ee2c7-b12a-4243-a1b3-d4edae3a6669',
      },
      completedAt: {
        universalIdentifier: '6cc67e58-2852-4374-ac30-bde7b54037e0',
      },
      ownerId: {
        universalIdentifier: '374c6abe-9471-4bca-88ea-2fcd188146c6',
      },
      owner: {
        universalIdentifier: '575a864c-083b-4e9c-8e6e-057fd31180f5',
      },
      marketMaps: {
        universalIdentifier: 'b79e5c63-f5eb-43b1-b695-fa5e5742cb48',
      },
      researchCandidates: {
        universalIdentifier: 'd4ec001e-7360-4b8c-9f52-826771735690',
      },
    },
    indexes: {},
    views: {
      allResearchStrategies: {
        universalIdentifier: '0666c735-599f-4add-aba2-d12e8595e770',
        viewFields: {
          searchAssignmentId: {
            universalIdentifier: '4cd6a3cb-1d3b-41fa-bf0b-ec8ff74bd448',
          },
          name: {
            universalIdentifier: '66f3f0ea-8575-4b56-9876-3bc94750669c',
          },
          status: {
            universalIdentifier: '1ac00c5c-afe2-4e31-8769-07af86acc0e3',
          },
          priority: {
            universalIdentifier: '21fad571-1c4b-4824-bbb9-00a9876a6fdc',
          },
          objectives: {
            universalIdentifier: '41c9c54f-a52e-448e-85e6-a2bb69304324',
          },
          targetSegments: {
            universalIdentifier: '143e272f-e8eb-4217-88e6-e85e47ee8b12',
          },
          sourcingChannels: {
            universalIdentifier: 'c8f1131c-0fce-417b-8161-57f4e4e70f8d',
          },
          targetCandidateCount: {
            universalIdentifier: 'd002a83e-3d8e-4caa-ac92-114972381d19',
          },
          startDate: {
            universalIdentifier: '2106b84b-5fdd-40ec-945f-345e16bc9727',
          },
          targetCompletionDate: {
            universalIdentifier: '8ea3a1f8-33f5-4327-82cd-4d277f6f7840',
          },
          completedAt: {
            universalIdentifier: 'fe48a346-0b54-43b7-9e4a-f8c4c6c3a1ee',
          },
          ownerId: {
            universalIdentifier: 'f159a1da-629e-4cc0-82de-7b0f240ee57d',
          },
          owner: {
            universalIdentifier: '8244083a-b625-4376-aa3e-b7b710ba9ad1',
          },
          marketMaps: {
            universalIdentifier: '11b8c481-cfee-47bc-b05a-07ae684bf5e1',
          },
          researchCandidates: {
            universalIdentifier: '89596416-0ba1-449f-b20d-39a09c78ecdb',
          },
        },
      },
    },
  },
  targetCompany: {
    universalIdentifier: 'e84ba25c-c010-4ed9-858d-c03639d604ad',
    fields: {
      ...buildStandardObjectSystemFields(
        'e84ba25c-c010-4ed9-858d-c03639d604ad',
      ),
      marketMap: {
        universalIdentifier: 'be3e6c7f-f3d7-4e30-82c4-c20782159be2',
      },
      company: {
        universalIdentifier: 'ef224b0c-1316-4f75-bf7c-fbcd458f3998',
      },
      companyName: {
        universalIdentifier: '7d6ffa2a-a44a-4426-bffb-340e8facd8e0',
      },
      domain: {
        universalIdentifier: '686a38f5-57fb-4810-8863-33ca6e9fe98d',
      },
      industry: {
        universalIdentifier: 'f3aaed04-d629-4bb4-b199-2863e4218cda',
      },
      sizeBand: {
        universalIdentifier: '63d991fe-37ce-4cfa-a74e-eed136b3ba62',
      },
      tier: {
        universalIdentifier: 'cb45b370-7090-497a-b3d5-64a907bbda6e',
      },
      attractiveness: {
        universalIdentifier: '4466b8bf-1585-4c9a-96ee-37816beccf15',
      },
      headquartersLocation: {
        universalIdentifier: '91333592-1730-4cf6-8b32-ea1814dfce6e',
      },
      rationale: {
        universalIdentifier: '3d90940b-e077-45fc-a0ef-a5ebbfab8726',
      },
      researchCandidates: {
        universalIdentifier: '3d10d863-4c12-4147-917a-33e419be4245',
      },
    },
    indexes: {},
    views: {
      allTargetCompanies: {
        universalIdentifier: '1a4c99c5-3c63-404b-988f-3beaf013aef5',
        viewFields: {
          marketMap: {
            universalIdentifier: '805bc6a5-7b7f-4b32-98c1-2b74c1d37937',
          },
          company: {
            universalIdentifier: 'bf556e1f-f2a1-4daf-a599-039d59ffa279',
          },
          companyName: {
            universalIdentifier: 'c2fd3ff3-1bf1-4480-93d4-cabb376ed10c',
          },
          domain: {
            universalIdentifier: '6b626cfc-4029-4530-a34b-8a93862d3ef9',
          },
          industry: {
            universalIdentifier: 'd6bfe0ab-ce66-4a1e-abb0-cf6661eb5773',
          },
          sizeBand: {
            universalIdentifier: 'ddeb5c0a-c72e-440e-b117-bd18a2d07721',
          },
          tier: {
            universalIdentifier: '239c26a8-3eb8-4767-9c0b-f4ac5c7a9546',
          },
          attractiveness: {
            universalIdentifier: '5c5d4ee6-25db-4e5c-baa7-ceb31111d145',
          },
          headquartersLocation: {
            universalIdentifier: '6728d85a-963d-4c0c-b5ac-2a3a3d8391f8',
          },
          rationale: {
            universalIdentifier: 'ffa3fa85-8440-40b8-8954-a891c5f05f0e',
          },
          researchCandidates: {
            universalIdentifier: '86e73325-0f74-46db-bfb1-78093fe73343',
          },
        },
      },
    },
  },
  executiveAward: {
    universalIdentifier: 'cc229997-5392-47cb-b8c6-093092b10821',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-6fbf-44b3-9797-60fe520e0927',
      ),
      name: { universalIdentifier: '20202020-a0b0-445a-a128-f1d72efbdb3c' },
      role: { universalIdentifier: '20202020-396a-415a-ab4c-d1e473c05af4' },
      isPrimary: {
        universalIdentifier: '20202020-73a6-4b72-9d36-8fa2240c4c12',
      },
      notes: { universalIdentifier: '20202020-5e4c-494d-9473-afc0b884eb31' },
      person: { universalIdentifier: '20202020-c7f7-49bb-941c-81dfde307370' },
      company: {
        universalIdentifier: '20202020-ed0a-4d0a-b977-21e61a039eed',
      },
      clientAccountProfile: {
        universalIdentifier: '20202020-9cd9-4c20-b0cf-50ba3ed5e65d',
      },
    },
    indexes: {
      personCompanyUniqueIndex: {
        universalIdentifier: '20202020-3bf7-4920-a283-d1363c5dcc5f',
      },
      companyIdIndex: {
        universalIdentifier: '20202020-0ece-43c5-a5d3-6cfa973756af',
      },
      searchVectorGinIndex: {
        universalIdentifier: '20202020-3216-4e8d-8221-c0a1bff7c30c',
      },
    },
  },
  deadLetterRecord: {
    universalIdentifier: 'f6ee0fc1-463a-449a-a03b-1ebaf43244b4',
    fields: {
      ...buildStandardObjectSystemFields(
        'f6ee0fc1-463a-449a-a03b-1ebaf43244b4',
      ),
      eventId: {
        universalIdentifier: 'a742b070-64da-4d86-8ec1-52c1735b5091',
      },
      idempotencyKey: {
        universalIdentifier: '2f0866a9-d51c-4543-8edf-3cfe9d5a97c2',
      },
      originalQueue: {
        universalIdentifier: 'a31fd7c2-0f9a-4f29-9311-1148768f3877',
      },
      payload: {
        universalIdentifier: 'bfcebd11-78b1-4ef2-8c4f-8d69eb525258',
      },
      lastErrorCode: {
        universalIdentifier: 'f8c607c2-2742-4618-99ca-d46a575c6d14',
      },
      lastErrorAt: {
        universalIdentifier: '135add85-7e8e-42d8-bc85-8221e65551c9',
      },
      attempts: {
        universalIdentifier: 'ae7f4778-be66-4bb6-acd5-91abc6dfe429',
      },
      isReplayed: {
        universalIdentifier: '666455bb-e95a-4308-802f-4e4a3f48e40b',
      },
      replayedAt: {
        universalIdentifier: 'e4a522ad-8448-43ed-b774-f1504ca9fc45',
      },
    },
    indexes: {},
  },
  reconciliationRun: {
    universalIdentifier: '96ae8734-dd75-4d7b-9861-69e49129d540',
    fields: {
      ...buildStandardObjectSystemFields(
        '96ae8734-dd75-4d7b-9861-69e49129d540',
      ),
      status: {
        universalIdentifier: '7257e141-95db-4931-9799-a97766bee3be',
      },
      startedAt: {
        universalIdentifier: '07460985-88db-4de5-88cf-e9f7a28158fc',
      },
      completedAt: {
        universalIdentifier: '643b81b6-c23a-4344-9848-67ff40451aa8',
      },
      recordsCompared: {
        universalIdentifier: '1bb00cc0-1289-44a4-aa7b-123149a0da0f',
      },
      findingsCount: {
        universalIdentifier: 'f479e2aa-7537-44b8-b442-d1155313da93',
      },
    },
    indexes: {},
  },
  reconciliationFinding: {
    universalIdentifier: 'a08275a6-9f9e-434b-8725-4b02f3b62761',
    fields: {
      ...buildStandardObjectSystemFields(
        'a08275a6-9f9e-434b-8725-4b02f3b62761',
      ),
      runId: {
        universalIdentifier: '82e38c6d-be3e-42f4-ac3d-f50d7e38f41d',
      },
      externalCollection: {
        universalIdentifier: '2e361597-3178-46f1-804c-e3846657bbee',
      },
      externalId: {
        universalIdentifier: '929508d3-3ec4-4ab6-9663-4891e3106748',
      },
      twentyRecordId: {
        universalIdentifier: 'dc4e256d-48de-4b28-b084-a2ca27f14dbe',
      },
      findingType: {
        universalIdentifier: '327c58b1-acf3-47cf-b9bd-1ca3a7b3f442',
      },
      severity: {
        universalIdentifier: 'bf63ee16-188e-472e-bba6-732926ca475b',
      },
      details: {
        universalIdentifier: '9880540d-ca9f-44e9-9e2e-9eccd0bc02fc',
      },
      resolvedAt: {
        universalIdentifier: 'b154cd03-4bd4-40b5-ae84-dcb9700d940c',
      },
    },
    indexes: {},
  },
  searchEngagementTerms: {
    universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8b9c',
    fields: {
      ...buildStandardObjectSystemFields(
        '20202020-7a3e-4c9d-b2f8-1e5c6d7a8b9c',
      ),
      name: { universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8ba1' },
      opportunity: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8ba2',
      },
      termsType: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8ba3',
      },
      feeStructure: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8ba4',
      },
      feePercentage: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8ba5',
      },
      fixedFeeAmount: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8ba6',
      },
      exclusivity: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8ba7',
      },
      exclusivityDurationMonths: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8ba8',
      },
      engagementStartDate: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8ba9',
      },
      engagementEndDate: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8baa',
      },
      durationMonths: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8bab',
      },
      guaranteePeriodMonths: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8bac',
      },
      paymentSchedule: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8bad',
      },
      taskTargets: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8bae',
      },
      noteTargets: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8baf',
      },
      attachments: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8bb0',
      },
      timelineActivities: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8bb1',
      },
      owner: {
        universalIdentifier: '20202020-7a3e-4c9d-b2f8-1e5c6d7a8bb2',
      },
    },
    indexes: {
      opportunityIdIndex: {
        universalIdentifier: '7a3eb2c8-9d1e-4f5a-8b3c-6d7e8f9a0b1c',
      },
      termsTypeIndex: {
        universalIdentifier: '8b4fc3d9-0e2f-4a6b-9c4d-7e8f9a0b1c2d',
      },
    },
    views: {
      allSearchEngagementTerms: {
        universalIdentifier: '9c5a0d4e-1f3a-4b7c-0d5e-8f9a0b1c2d3e',
        viewFields: {
          name: {
            universalIdentifier: '0d6b1e5f-2a4b-4c8d-1e6f-9a0b1c2d3e4f',
          },
          opportunity: {
            universalIdentifier: '1e7c2f6a-3b5c-4d9e-2f7a-0b1c2d3e4f5a',
          },
          termsType: {
            universalIdentifier: '2f8d3a7b-4c6d-4e0f-3a8b-1c2d3e4f5a6b',
          },
          feeStructure: {
            universalIdentifier: '3a9e4b8c-5d7e-4f1a-4b9c-2d3e4f5a6b7c',
          },
          paymentSchedule: {
            universalIdentifier: '4b0f5c9d-6e8f-4a2b-5c0d-3e4f5a6b7c8d',
          },
          createdAt: {
            universalIdentifier: '5c1a6d0e-7f9a-4b3c-6d1e-4f5a6b7c8d9e',
          },
        },
      },
      searchEngagementTermsRecordPageFields: {
        universalIdentifier: '6d2b7e1f-8a0b-4c4d-7e2f-5a6b7c8d9e0f',
        viewFieldGroups: {
          general: {
            universalIdentifier: '7e3c8f2a-9b1c-4d5e-8f3a-6b7c8d9e0f1a',
          },
          system: {
            universalIdentifier: '8f4d9a3b-0c2d-4e6f-9a4b-7c8d9e0f1a2b',
          },
        },
        viewFields: {
          name: {
            universalIdentifier: '9a5e0b4c-1d3e-4f7a-0b5c-8d9e0f1a2b3c',
          },
          opportunity: {
            universalIdentifier: '0b6f1c5d-2e4f-4a8b-1c6d-9e0f1a2b3c4d',
          },
          termsType: {
            universalIdentifier: '1c7a2d6e-3f5a-4b9c-2d7e-0f1a2b3c4d5e',
          },
          feeStructure: {
            universalIdentifier: '2d8b3e7f-4a6b-4c0d-3e8f-1a2b3c4d5e6f',
          },
          feePercentage: {
            universalIdentifier: '3e9c4f8a-5b7c-4d1e-4f9a-2b3c4d5e6f7a',
          },
          fixedFeeAmount: {
            universalIdentifier: '4f0d5a9b-6c8d-4e2f-5a0b-3c4d5e6f7a8b',
          },
          exclusivity: {
            universalIdentifier: '5a1e6b0c-7d9e-4f3a-6b1c-4d5e6f7a8b9c',
          },
          exclusivityDurationMonths: {
            universalIdentifier: '6b2f7c1d-8e0f-4a4b-7c2d-5e6f7a8b9c0d',
          },
          engagementStartDate: {
            universalIdentifier: '7c3a8d2e-9f1a-4b5c-8d3e-6f7a8b9c0d1e',
          },
          engagementEndDate: {
            universalIdentifier: '8d4b9e3f-0a2b-4c6d-9e4f-7a8b9c0d1e2f',
          },
          durationMonths: {
            universalIdentifier: '9e5c0f4a-1b3c-4d7e-0f5a-8b9c0d1e2f3a',
          },
          guaranteePeriodMonths: {
            universalIdentifier: '0f6d1a5b-2c4d-4e8f-1a6b-9c0d1e2f3a4b',
          },
          paymentSchedule: {
            universalIdentifier: '1a7e2b6c-3d5e-4f9a-2b7c-0d1e2f3a4b5c',
          },
          createdAt: {
            universalIdentifier: '2b8f3c7d-4e6f-4a0b-3c8d-1e2f3a4b5c6d',
          },
          createdBy: {
            universalIdentifier: '3c9a4d8e-5f7a-4b1c-4d9e-2f3a4b5c6d7e',
          },
          updatedAt: {
            universalIdentifier: '4d0b5e9f-6a8b-4c2d-5e0f-3a4b5c6d7e8f',
          },
          updatedBy: {
            universalIdentifier: '5e1c6f0a-7b9c-4d3e-6f1a-4b5c6d7e8f9a',
          },
          taskTargets: {
            universalIdentifier: '6f2d7a1b-8c0d-4e4f-7a2b-5c6d7e8f9a0b',
          },
          noteTargets: {
            universalIdentifier: '7a3e8b2c-9d1e-4f5a-8b3c-6d7e8f9a0b1c',
          },
          attachments: {
            universalIdentifier: '8b4f9c3d-0e2f-4a6b-9c4d-7e8f9a0b1c2d',
          },
          timelineActivities: {
            universalIdentifier: '9c5a0d4e-1f3a-4b7c-0d5e-8f9a0b1c2d3e',
          },
        },
      },
    },
  },
  searchAssignment: {
    universalIdentifier: '117835c8-f40a-49b1-9850-121e38a0aad8',
    fields: {
      ...buildStandardObjectSystemFields(
        '117835c8-f40a-49b1-9850-121e38a0aad8',
      ),
      name: { universalIdentifier: 'd1e5e264-b4df-4449-8275-1b4c8be917e0' },
      status: { universalIdentifier: '8c36c4df-0506-4e4a-9712-4189813837a6' },
      startDate: {
        universalIdentifier: '26898857-2db4-47ec-91d1-329d4a0eab33',
      },
      targetCloseDate: {
        universalIdentifier: 'c6e360eb-be1f-4424-abfb-4bb05ae76a46',
      },
      clientCompany: {
        universalIdentifier: 'dda4adf9-2760-42e4-a674-4961a270a87f',
      },
      clientCompanyId: {
        universalIdentifier: '8f3589bf-ffa0-4692-9e49-f6fa5ae1ded0',
      },
      opportunity: {
        universalIdentifier: '5c1e5361-b58b-4fdf-9bd8-cddfe2b7a4da',
      },
      opportunityId: {
        universalIdentifier: '9893fd92-dffe-4119-af40-49fb26a8375b',
      },
      engagementTerms: {
        universalIdentifier: 'e47a8bbe-ee34-4b24-9b1b-deb9fa592dd9',
      },
      engagementTermsId: {
        universalIdentifier: '553f6e72-be10-4da3-b035-cb943bcc5ee2',
      },
      positionSpecification: {
        universalIdentifier: 'e07cf8a6-776f-4d19-b74e-687d8b75188d',
      },
      positionSpecificationId: {
        universalIdentifier: '0fb1f494-3c24-479b-b8e6-350d2722ca2b',
      },
      teamMembers: {
        universalIdentifier: 'a9d4ef48-301e-4839-863c-3bb0d6589a54',
      },
      milestones: {
        universalIdentifier: 'c4bfb759-0544-4660-8bad-af1017a8bf9f',
      },
      candidacies: {
        universalIdentifier: '117835c8-0550-4660-8bad-af1017a8bfa0',
      },
    },
    indexes: {
      statusIndex: {
        universalIdentifier: '68f0a0da-669f-47b9-becd-d304f2972def',
      },
      clientCompanyIdIndex: {
        universalIdentifier: '8c469f0d-0244-415a-8e13-f21d7814cfab',
      },
      opportunityIdIndex: {
        universalIdentifier: 'b344be4e-bfee-4898-b2a1-21046f2676ec',
      },
      engagementTermsIdIndex: {
        universalIdentifier: 'ce047159-90ae-40ce-a643-ddfb7c30c58d',
      },
      positionSpecificationIdIndex: {
        universalIdentifier: '1f4a0b10-aaaa-4aaa-8aaa-1f4a0b10aaaa',
      },
      searchVectorGinIndex: {
        universalIdentifier: '19b74e1a-f4b9-42e1-938a-6916e9ee86d3',
      },
    },
    views: {
      allSearchAssignments: {
        universalIdentifier: '161ba20f-9897-40c9-b966-4960e304b733',
        viewFields: {
          name: { universalIdentifier: '161ba20f-1001-40c9-b966-4960e304b701' },
          status: {
            universalIdentifier: '161ba20f-1002-40c9-b966-4960e304b702',
          },
          startDate: {
            universalIdentifier: '161ba20f-1003-40c9-b966-4960e304b703',
          },
          targetCloseDate: {
            universalIdentifier: '161ba20f-1004-40c9-b966-4960e304b704',
          },
          clientCompany: {
            universalIdentifier: '161ba20f-1005-40c9-b966-4960e304b705',
          },
          opportunity: {
            universalIdentifier: '161ba20f-1006-40c9-b966-4960e304b706',
          },
          createdAt: {
            universalIdentifier: '161ba20f-1007-40c9-b966-4960e304b707',
          },
        },
      },
      byStatus: {
        universalIdentifier: 'a7a2b97c-a426-4cca-aedf-7183cc22d21e',
        viewFields: {
          name: { universalIdentifier: 'a7a2b97c-1001-4cca-aedf-7183cc22d201' },
          status: {
            universalIdentifier: 'a7a2b97c-1002-4cca-aedf-7183cc22d202',
          },
          startDate: {
            universalIdentifier: 'a7a2b97c-1003-4cca-aedf-7183cc22d203',
          },
          targetCloseDate: {
            universalIdentifier: 'a7a2b97c-1004-4cca-aedf-7183cc22d204',
          },
          clientCompany: {
            universalIdentifier: 'a7a2b97c-1005-4cca-aedf-7183cc22d205',
          },
          opportunity: {
            universalIdentifier: 'a7a2b97c-1006-4cca-aedf-7183cc22d206',
          },
          createdAt: {
            universalIdentifier: 'a7a2b97c-1007-4cca-aedf-7183cc22d207',
          },
        },
        viewGroups: {
          new: { universalIdentifier: 'a7a2b97c-2001-4cca-aedf-7183cc22d301' },
          inProgress: {
            universalIdentifier: 'a7a2b97c-2002-4cca-aedf-7183cc22d302',
          },
          completed: {
            universalIdentifier: 'a7a2b97c-2003-4cca-aedf-7183cc22d303',
          },
        },
      },
      searchAssignmentRecordPageFields: {
        universalIdentifier: 'ec1969dc-46f1-45ad-901f-c2dc10a3530b',
        viewFieldGroups: {
          general: {
            universalIdentifier: 'ec1969dc-1001-45ad-901f-c2dc10a35300',
          },
        },
        viewFields: {
          name: { universalIdentifier: 'ec1969dc-2001-45ad-901f-c2dc10a35301' },
          status: {
            universalIdentifier: 'ec1969dc-2002-45ad-901f-c2dc10a35302',
          },
          startDate: {
            universalIdentifier: 'ec1969dc-2003-45ad-901f-c2dc10a35303',
          },
          targetCloseDate: {
            universalIdentifier: 'ec1969dc-2004-45ad-901f-c2dc10a35304',
          },
          clientCompany: {
            universalIdentifier: 'ec1969dc-2005-45ad-901f-c2dc10a35305',
          },
          opportunity: {
            universalIdentifier: 'ec1969dc-2006-45ad-901f-c2dc10a35306',
          },
          engagementTerms: {
            universalIdentifier: 'ec1969dc-2007-45ad-901f-c2dc10a35307',
          },
          positionSpecification: {
            universalIdentifier: 'ec1969dc-2008-45ad-901f-c2dc10a35308',
          },
          createdAt: {
            universalIdentifier: 'ec1969dc-2009-45ad-901f-c2dc10a35309',
          },
          createdBy: {
            universalIdentifier: 'ec1969dc-2010-45ad-901f-c2dc10a35310',
          },
        },
      },
    },
  },
  assignmentTeamMember: {
    universalIdentifier: '34215453-0481-4f36-8421-19db129ca554',
    fields: {
      ...buildStandardObjectSystemFields(
        '34215453-0481-4f36-8421-19db129ca554',
      ),
      role: { universalIdentifier: '91ff5774-c53c-4833-b7ff-dc56818d6853' },
      isLead: { universalIdentifier: '0aca99c5-1cd5-41cd-8ec5-148468dd0662' },
      assignment: {
        universalIdentifier: '32d010d2-d837-4ed7-8993-6a967c35ea06',
      },
      assignmentId: {
        universalIdentifier: '7ddc2275-9883-4e03-af27-b649b0dee51d',
      },
      workspaceMember: {
        universalIdentifier: '55d97d23-df7f-49bc-a323-f1dd06b3fb77',
      },
      workspaceMemberId: {
        universalIdentifier: '3a0b5ffe-9704-4f54-abda-b5e16daada4c',
      },
    },
    indexes: {
      assignmentIdIndex: {
        universalIdentifier: '63f9a3ef-c627-4a5f-9133-df18ae87e164',
      },
      workspaceMemberIdIndex: {
        universalIdentifier: '9612e959-ba21-47fd-8307-9c26353edbb4',
      },
    },
    views: {
      assignmentTeamMemberRecordPageFields: {
        universalIdentifier: 'a3ed9f80-6e00-46e0-aa37-218c6b983332',
        viewFieldGroups: {
          general: {
            universalIdentifier: 'a3ed9f80-1001-46e0-aa37-218c6b983300',
          },
        },
        viewFields: {
          role: { universalIdentifier: 'a3ed9f80-2001-46e0-aa37-218c6b983301' },
          isLead: {
            universalIdentifier: 'a3ed9f80-2002-46e0-aa37-218c6b983302',
          },
          assignment: {
            universalIdentifier: 'a3ed9f80-2003-46e0-aa37-218c6b983303',
          },
          workspaceMember: {
            universalIdentifier: 'a3ed9f80-2004-46e0-aa37-218c6b983304',
          },
          createdAt: {
            universalIdentifier: 'a3ed9f80-2005-46e0-aa37-218c6b983305',
          },
          createdBy: {
            universalIdentifier: 'a3ed9f80-2006-46e0-aa37-218c6b983306',
          },
        },
      },
    },
  },
  searchMilestone: {
    universalIdentifier: 'df757f76-8050-4d18-b24d-cdb5d31789b6',
    fields: {
      ...buildStandardObjectSystemFields(
        'df757f76-8050-4d18-b24d-cdb5d31789b6',
      ),
      name: { universalIdentifier: 'a3526562-0e22-4624-a921-311872df14cc' },
      description: {
        universalIdentifier: '835851b3-e59c-4e62-8b7e-9caeeae70638',
      },
      dueDate: { universalIdentifier: 'e7832211-f34d-458c-8926-ef663000dd97' },
      completedAt: {
        universalIdentifier: 'd49a266f-588f-424f-8152-a153c6338a26',
      },
      status: { universalIdentifier: '3aa3fd66-cdb7-47c0-a50c-43a2f87ccac0' },
      assignment: {
        universalIdentifier: '3ec12b4c-d9c4-482c-9027-07ae65b0b12a',
      },
      assignmentId: {
        universalIdentifier: 'ea78e8a7-d5ff-4c4b-8c43-b3ebf80d1f42',
      },
    },
    indexes: {
      assignmentIdIndex: {
        universalIdentifier: '0c1bba57-dcee-4c97-aa43-2e1108540ff1',
      },
      statusIndex: {
        universalIdentifier: '4d3ca8db-db3f-49ce-9040-680fb38c9288',
      },
    },
    views: {
      searchMilestoneRecordPageFields: {
        universalIdentifier: 'f832e3d5-3cc3-4325-be47-19c6745b6371',
        viewFieldGroups: {
          general: {
            universalIdentifier: 'f832e3d5-1001-4325-be47-19c6745b6300',
          },
        },
        viewFields: {
          name: { universalIdentifier: 'f832e3d5-2001-4325-be47-19c6745b6301' },
          status: {
            universalIdentifier: 'f832e3d5-2002-4325-be47-19c6745b6302',
          },
          dueDate: {
            universalIdentifier: 'f832e3d5-2003-4325-be47-19c6745b6303',
          },
          completedAt: {
            universalIdentifier: 'f832e3d5-2004-4325-be47-19c6745b6304',
          },
          description: {
            universalIdentifier: 'f832e3d5-2005-4325-be47-19c6745b6305',
          },
          assignment: {
            universalIdentifier: 'f832e3d5-2006-4325-be47-19c6745b6306',
          },
          createdAt: {
            universalIdentifier: 'f832e3d5-2007-4325-be47-19c6745b6307',
          },
          createdBy: {
            universalIdentifier: 'f832e3d5-2008-4325-be47-19c6745b6308',
          },
        },
      },
    },
  },
  positionSpecification: {
    universalIdentifier: '4b48256c-78bd-4215-8099-ab68c42d06e2',
    fields: {
      ...buildStandardObjectSystemFields(
        '4b48256c-78bd-4215-8099-ab68c42d06e2',
      ),
      name: { universalIdentifier: '27a2379c-c2fc-4575-92ba-e5876312c2cf' },
      reportingLine: {
        universalIdentifier: 'fc3c15dc-ee4b-4cb9-b95f-93dcba1e510d',
      },
      compensationMin: {
        universalIdentifier: 'aa4ff04e-d0a7-4613-86c9-ed4892001340',
      },
      compensationMax: {
        universalIdentifier: '313b59a8-f266-4ecc-a144-559f84a145b9',
      },
      keyResponsibilities: {
        universalIdentifier: '4080cf34-b118-40db-a1b7-ddffcf1bcc66',
      },
      requiredQualifications: {
        universalIdentifier: '7c478ba0-33c7-4528-9bdc-5db4764a6838',
      },
      preferredQualifications: {
        universalIdentifier: '6e8bd1f0-24ff-4450-a7b4-1e4dbf96ebec',
      },
      status: { universalIdentifier: 'df750535-3e7c-4ad7-8d4e-96c83ea1b136' },
      approvedAt: {
        universalIdentifier: '1311e53b-cbf0-4b3d-8cb0-8c4d92c6da15',
      },
      approvedBy: {
        universalIdentifier: 'c27a404b-f794-493d-acf6-214d11bcd4c9',
      },
      approvedById: {
        universalIdentifier: '8c77cebf-4ffe-4d56-8277-cb97e1a3e9b1',
      },
      assignment: {
        universalIdentifier: '8f6cd096-eb4c-4ecc-a502-5adf6fb25e68',
      },
      criteria: { universalIdentifier: '021dcea4-e476-4a17-a161-5e52313dd525' },
    },
    indexes: {
      statusIndex: {
        universalIdentifier: '13292b48-1576-4ccf-b4df-d14ba4f879df',
      },
      approvedByIdIndex: {
        universalIdentifier: 'b99c86cb-602f-463a-b870-c3d8d30f4764',
      },
      searchVectorGinIndex: {
        universalIdentifier: '021da232-9488-451c-961d-12f0ad8874ec',
      },
    },
    views: {
      allPositionSpecifications: {
        universalIdentifier: '4c6fac13-44c6-4266-ac0a-8fbc7d83991b',
        viewFields: {
          name: { universalIdentifier: '4c6fac13-1001-4266-ac0a-8fbc7d839901' },
          status: {
            universalIdentifier: '4c6fac13-1002-4266-ac0a-8fbc7d839902',
          },
          compensationMin: {
            universalIdentifier: '4c6fac13-1003-4266-ac0a-8fbc7d839903',
          },
          compensationMax: {
            universalIdentifier: '4c6fac13-1004-4266-ac0a-8fbc7d839904',
          },
          approvedBy: {
            universalIdentifier: '4c6fac13-1005-4266-ac0a-8fbc7d839905',
          },
          createdAt: {
            universalIdentifier: '4c6fac13-1006-4266-ac0a-8fbc7d839906',
          },
        },
      },
      positionSpecificationRecordPageFields: {
        universalIdentifier: 'a02a9066-2fe3-435a-b358-8ff348f8f0c2',
        viewFieldGroups: {
          general: {
            universalIdentifier: 'a02a9066-1001-435a-b358-8ff348f8f000',
          },
        },
        viewFields: {
          name: { universalIdentifier: 'a02a9066-2001-435a-b358-8ff348f8f001' },
          reportingLine: {
            universalIdentifier: 'a02a9066-2002-435a-b358-8ff348f8f002',
          },
          compensationMin: {
            universalIdentifier: 'a02a9066-2003-435a-b358-8ff348f8f003',
          },
          compensationMax: {
            universalIdentifier: 'a02a9066-2004-435a-b358-8ff348f8f004',
          },
          keyResponsibilities: {
            universalIdentifier: 'a02a9066-2005-435a-b358-8ff348f8f005',
          },
          requiredQualifications: {
            universalIdentifier: 'a02a9066-2006-435a-b358-8ff348f8f006',
          },
          preferredQualifications: {
            universalIdentifier: 'a02a9066-2007-435a-b358-8ff348f8f007',
          },
          status: {
            universalIdentifier: 'a02a9066-2008-435a-b358-8ff348f8f008',
          },
          approvedAt: {
            universalIdentifier: 'a02a9066-2009-435a-b358-8ff348f8f009',
          },
          approvedBy: {
            universalIdentifier: 'a02a9066-2010-435a-b358-8ff348f8f010',
          },
          criteria: {
            universalIdentifier: 'a02a9066-2011-435a-b358-8ff348f8f011',
          },
          createdAt: {
            universalIdentifier: 'a02a9066-2012-435a-b358-8ff348f8f012',
          },
          createdBy: {
            universalIdentifier: 'a02a9066-2013-435a-b358-8ff348f8f013',
          },
        },
      },
    },
  },
  searchCriterion: {
    universalIdentifier: '2b2b26cc-fe25-49d7-9a71-192e8923dd95',
    fields: {
      ...buildStandardObjectSystemFields(
        '2b2b26cc-fe25-49d7-9a71-192e8923dd95',
      ),
      name: { universalIdentifier: '53c122c6-bc6f-448f-8958-3c2e022f76f6' },
      description: {
        universalIdentifier: '88f48e03-25a2-4daa-954f-ef3c6776a4c3',
      },
      weight: { universalIdentifier: '5dbb5a07-c8f1-405e-a535-22992a0b912d' },
      category: { universalIdentifier: '9376e73e-5d68-4859-9bc6-c64f4d4e2957' },
      isRequired: {
        universalIdentifier: '98eb9997-ed40-43a2-8086-2f528f44d724',
      },
      specification: {
        universalIdentifier: 'c772a84a-9bca-415a-96a5-8f6aca8eae10',
      },
      specificationId: {
        universalIdentifier: 'a75b41e9-a37a-4cef-9601-4ca0a18e9626',
      },
    },
    indexes: {
      specificationIdIndex: {
        universalIdentifier: '5024347a-f5b8-44b5-9e82-33f6989ee697',
      },
      categoryIndex: {
        universalIdentifier: '9ff620bb-de6d-4242-a3ec-757b350ef5d4',
      },
    },
    views: {
      searchCriterionRecordPageFields: {
        universalIdentifier: '52a16eed-30c2-449e-9ddf-0de75aa6b829',
        viewFieldGroups: {
          general: {
            universalIdentifier: '52a16eed-1001-449e-9ddf-0de75aa6b800',
          },
        },
        viewFields: {
          name: { universalIdentifier: '52a16eed-2001-449e-9ddf-0de75aa6b801' },
          weight: {
            universalIdentifier: '52a16eed-2002-449e-9ddf-0de75aa6b802',
          },
          category: {
            universalIdentifier: '52a16eed-2003-449e-9ddf-0de75aa6b803',
          },
          isRequired: {
            universalIdentifier: '52a16eed-2004-449e-9ddf-0de75aa6b804',
          },
          description: {
            universalIdentifier: '52a16eed-2005-449e-9ddf-0de75aa6b805',
          },
          specification: {
            universalIdentifier: '52a16eed-2006-449e-9ddf-0de75aa6b806',
          },
          createdAt: {
            universalIdentifier: '52a16eed-2007-449e-9ddf-0de75aa6b807',
          },
          createdBy: {
            universalIdentifier: '52a16eed-2008-449e-9ddf-0de75aa6b808',
          },
        },
      },
    },
  },
  offLimitsRestriction: {
    universalIdentifier: 'e111382e-ffdd-4d96-ba02-10df8240fa76',
    fields: {
      ...buildStandardObjectSystemFields(
        'e111382e-ffdd-4d96-ba02-10df8240fa76',
      ),
      company: {
        universalIdentifier: '493fdfc9-81a4-4e37-be20-a57f8ac01a3c',
      },
      person: {
        universalIdentifier: '1214482c-57f3-4ff1-9950-58b2659c75b6',
      },
      clientCompany: {
        universalIdentifier: '07402159-f38e-4566-82ce-1c8d00332c2e',
      },
      summary: {
        universalIdentifier: '07f970ab-0638-4ab3-8015-7b7935fec8b4',
      },
      restrictionScope: {
        universalIdentifier: '525d903c-a7c8-493e-b00c-d619de1f4d03',
      },
      restrictionType: {
        universalIdentifier: '839b96de-1fa6-40f7-9987-f4ce2785f2c6',
      },
      basis: {
        universalIdentifier: 'd502ccd5-e9cb-4578-b3b0-7cbeab69b1b8',
      },
      status: {
        universalIdentifier: 'f4bcb28c-f4ce-427c-a97b-7f36edf8ece5',
      },
      clientName: {
        universalIdentifier: '377ecefb-9f27-4107-a291-4a4f6df06701',
      },
      startDate: {
        universalIdentifier: '839a09f6-ead7-4841-bc36-dc2522943127',
      },
      endDate: {
        universalIdentifier: '2e528e71-4e11-4028-8739-ff78b375a9d5',
      },
      waiverReason: {
        universalIdentifier: '33455376-9c1d-4cf5-8dcf-568fb76d1307',
      },
      waivedAt: {
        universalIdentifier: '01a618bd-9227-4c1d-a4a5-a5e3661e4000',
      },
      notes: {
        universalIdentifier: 'c48ec11b-f88f-43e7-841c-9d8edc7ed2e9',
      },
      reviewReason: {
        universalIdentifier: '5a3bb748-37f6-4095-93a2-941396d7e3a5',
      },
      conflictChecks: {
        universalIdentifier: 'e111382e-0001-4000-8000-000000000001',
      },
    },
    indexes: {},
    views: {
      allOffLimitsRestrictions: {
        universalIdentifier: 'f9140fed-2f5c-4349-ba7b-6e1c976aa7a5',
        viewFields: {
          summary: {
            universalIdentifier: '5efcf64e-ec1f-4d7a-828e-953a3c7d6d45',
          },
          restrictionScope: {
            universalIdentifier: 'b3943951-b50e-482d-a80e-b8b8c2bb11ad',
          },
          restrictionType: {
            universalIdentifier: '535b4a76-65ef-4bcf-b639-8121aa4998c5',
          },
          status: {
            universalIdentifier: '7b6180b3-0543-4259-971d-4b8c6c384670',
          },
          basis: {
            universalIdentifier: 'c1592825-207c-49ae-ab03-29b751dc4652',
          },
        },
      },
    },
  },
  relationshipEdge: {
    universalIdentifier: 'e10e3d9f-8ee3-469a-af73-fbca7bb12f3c',
    fields: {
      ...buildStandardObjectSystemFields(
        'e10e3d9f-8ee3-469a-af73-fbca7bb12f3c',
      ),
      sourcePerson: {
        universalIdentifier: '362e5171-a559-403f-a3a1-e5593bbd2e40',
      },
      targetPerson: {
        universalIdentifier: '7b75569a-f6b2-41d6-b8b4-73fcf1ec8ff3',
      },
      sourceCompany: {
        universalIdentifier: 'd44bd75e-4d88-47ab-8c41-ee34cbcf2cc0',
      },
      targetCompany: {
        universalIdentifier: '6a431e52-2aaa-4335-acff-9bcd2b1dae10',
      },
      summary: {
        universalIdentifier: '68c870d1-a557-41b8-ba1a-2feeb4ac1bc9',
      },
      relationshipType: {
        universalIdentifier: 'f85a2618-38c4-4f0a-8fe4-e96dda262ee8',
      },
      strength: {
        universalIdentifier: 'c2427ca6-f3fd-41ef-82a7-e5268b15b158',
      },
      source: {
        universalIdentifier: 'dc6f2777-07e7-4f88-8c2a-49bd512608b2',
      },
      confidenceLevel: {
        universalIdentifier: '5bfb8220-6ee5-492c-b69c-d459b7b76579',
      },
      context: {
        universalIdentifier: '1a3e6599-9976-48f5-980c-0cde3c256e1b',
      },
      notes: {
        universalIdentifier: 'f3914abe-8ae6-49a6-8627-ae2c2beda327',
      },
      observedAt: {
        universalIdentifier: 'ff4fce07-3676-4a28-9485-82149635edbc',
      },
    },
    indexes: {},
    views: {
      allRelationshipEdges: {
        universalIdentifier: 'ad9efc06-883a-49ab-b72d-a06ffea0e848',
        viewFields: {
          summary: {
            universalIdentifier: '38790458-273b-47e4-a7d1-4a3888fe9fdb',
          },
          relationshipType: {
            universalIdentifier: '373f1afc-f5a1-44c2-8f1c-6ecf44cad7b1',
          },
          strength: {
            universalIdentifier: '57d80680-73a6-43cb-865a-784be4a4bd14',
          },
          source: {
            universalIdentifier: '0744d697-7a8b-477a-a063-7535038b180e',
          },
          confidenceLevel: {
            universalIdentifier: 'f5b252e2-a502-4165-9062-bb6dd86ac805',
          },
          context: {
            universalIdentifier: '5c5cfb27-1aec-4645-b030-0dc640d0fbcc',
          },
          observedAt: {
            universalIdentifier: '867e7ccb-e45c-4bd3-a169-09020fee2828',
          },
          sourcePerson: {
            universalIdentifier: '4288b6c4-2262-4aff-8500-c6d2d9006158',
          },
          targetPerson: {
            universalIdentifier: '521ec94d-af0a-40d6-8a35-9ebd3d513ec6',
          },
          sourceCompany: {
            universalIdentifier: 'f52c7958-3eaa-48d1-811f-377d64f1e144',
          },
          targetCompany: {
            universalIdentifier: 'cb8f3ed0-5791-4934-9059-12897315d656',
          },
        },
      },
    },
  },
  candidacyStageEvent: {
    universalIdentifier: 'aeb1c000-1000-4e18-b24d-cdb5d3178000',
    fields: {
      ...buildStandardObjectSystemFields(
        'aeb1c000-1000-4e18-b24d-cdb5d3178000',
      ),
      stage: { universalIdentifier: 'aeb1c000-2001-4e18-b24d-cdb5d3178001' },
      stageFrom: {
        universalIdentifier: 'aeb1c000-2002-4e18-b24d-cdb5d3178002',
      },
      stageTo: { universalIdentifier: 'aeb1c000-2003-4e18-b24d-cdb5d3178003' },
      transitionedAt: {
        universalIdentifier: 'aeb1c000-2004-4e18-b24d-cdb5d3178004',
      },
      transitionedById: {
        universalIdentifier: 'aeb1c000-2005-4e18-b24d-cdb5d3178005',
      },
      actorKind: {
        universalIdentifier: 'aeb1c000-2006-4e18-b24d-cdb5d3178006',
      },
      reason: { universalIdentifier: 'aeb1c000-2007-4e18-b24d-cdb5d3178007' },
      notes: { universalIdentifier: 'aeb1c000-2008-4e18-b24d-cdb5d3178008' },
      isCandidateVisible: {
        universalIdentifier: 'aeb1c000-2009-4e18-b24d-cdb5d3178009',
      },
      candidacy: {
        universalIdentifier: 'aeb1c000-2010-4e18-b24d-cdb5d3178010',
      },
      candidacyId: {
        universalIdentifier: 'aeb1c000-2011-4e18-b24d-cdb5d3178011',
      },
    },
    indexes: {
      candidacyIdIndex: {
        universalIdentifier: 'aeb1c000-3001-4e18-b24d-cdb5d3178301',
      },
      transitionedAtIndex: {
        universalIdentifier: 'aeb1c000-3002-4e18-b24d-cdb5d3178302',
      },
    },
    views: {
      candidacyStageEventRecordPageFields: {
        universalIdentifier: 'aeb1c000-4001-4e18-b24d-cdb5d3178401',
        viewFieldGroups: {
          general: {
            universalIdentifier: 'aeb1c000-4002-4e18-b24d-cdb5d3178402',
          },
        },
        viewFields: {
          stage: {
            universalIdentifier: 'aeb1c000-5001-4e18-b24d-cdb5d3178501',
          },
          stageFrom: {
            universalIdentifier: 'aeb1c000-5002-4e18-b24d-cdb5d3178502',
          },
          stageTo: {
            universalIdentifier: 'aeb1c000-5003-4e18-b24d-cdb5d3178503',
          },
          transitionedAt: {
            universalIdentifier: 'aeb1c000-5004-4e18-b24d-cdb5d3178504',
          },
          transitionedById: {
            universalIdentifier: 'aeb1c000-5005-4e18-b24d-cdb5d3178505',
          },
          actorKind: {
            universalIdentifier: 'aeb1c000-5006-4e18-b24d-cdb5d3178506',
          },
          reason: {
            universalIdentifier: 'aeb1c000-5007-4e18-b24d-cdb5d3178507',
          },
          isCandidateVisible: {
            universalIdentifier: 'aeb1c000-5008-4e18-b24d-cdb5d3178508',
          },
          candidacy: {
            universalIdentifier: 'aeb1c000-5009-4e18-b24d-cdb5d3178509',
          },
          createdAt: {
            universalIdentifier: 'aeb1c000-5010-4e18-b24d-cdb5d3178510',
          },
          createdBy: {
            universalIdentifier: 'aeb1c000-5011-4e18-b24d-cdb5d3178511',
          },
        },
      },
    },
  },
  searchCandidacy: {
    universalIdentifier: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    fields: {
      ...buildStandardObjectSystemFields(
        'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
      ),
      name: { universalIdentifier: 'a1b2c3d4-e001-4a7b-8c9d-0e1f2a3b4001' },
      status: { universalIdentifier: 'a1b2c3d4-e002-4a7b-8c9d-0e1f2a3b4002' },
      currentStage: {
        universalIdentifier: 'a1b2c3d4-e003-4a7b-8c9d-0e1f2a3b4003',
      },
      assignedAt: {
        universalIdentifier: 'a1b2c3d4-e004-4a7b-8c9d-0e1f2a3b4004',
      },
      lastStageChangedAt: {
        universalIdentifier: 'a1b2c3d4-e005-4a7b-8c9d-0e1f2a3b4005',
      },
      closedAt: { universalIdentifier: 'a1b2c3d4-e006-4a7b-8c9d-0e1f2a3b4006' },
      notes: { universalIdentifier: 'a1b2c3d4-e007-4a7b-8c9d-0e1f2a3b4007' },
      candidateConsentDate: {
        universalIdentifier: 'a1b2c3d4-e008-4a7b-8c9d-0e1f2a3b4008',
      },
      searchAssignment: {
        universalIdentifier: 'a1b2c3d4-e009-4a7b-8c9d-0e1f2a3b4009',
      },
      searchAssignmentId: {
        universalIdentifier: 'a1b2c3d4-e00a-4a7b-8c9d-0e1f2a3b400a',
      },
      person: { universalIdentifier: 'a1b2c3d4-e00b-4a7b-8c9d-0e1f2a3b400b' },
      personId: { universalIdentifier: 'a1b2c3d4-e00c-4a7b-8c9d-0e1f2a3b400c' },
      researchCandidate: {
        universalIdentifier: 'a1b2c3d4-e00d-4a7b-8c9d-0e1f2a3b400d',
      },
      researchCandidateId: {
        universalIdentifier: 'a1b2c3d4-e00e-4a7b-8c9d-0e1f2a3b400e',
      },
      executiveProfile: {
        universalIdentifier: 'a1b2c3d4-e00f-4a7b-8c9d-0e1f2a3b400f',
      },
      executiveProfileId: {
        universalIdentifier: 'a1b2c3d4-e010-4a7b-8c9d-0e1f2a3b4010',
      },
      stageEvents: {
        universalIdentifier: 'a1b2c3d4-e011-4a7b-8c9d-0e1f2a3b4011',
      },
    },
    indexes: {
      searchAssignmentIdIndex: {
        universalIdentifier: 'b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e',
      },
      personIdIndex: {
        universalIdentifier: 'b1c2d3e4-f5a7-4b7c-8d9e-0f1a2b3c4d5f',
      },
      statusIndex: {
        universalIdentifier: 'b1c2d3e4-f5a8-4b7c-8d9e-0f1a2b3c4d60',
      },
    },
    views: {
      allSearchCandidacies: {
        universalIdentifier: 'c1d2e3f4-a5b6-4c7d-8e9f-0a1b2c3d4e5f',
        viewFields: {
          name: { universalIdentifier: 'c1d2e3f4-a001-4c7d-8e9f-0a1b2c3d4001' },
          status: {
            universalIdentifier: 'c1d2e3f4-a002-4c7d-8e9f-0a1b2c3d4002',
          },
          currentStage: {
            universalIdentifier: 'c1d2e3f4-a003-4c7d-8e9f-0a1b2c3d4003',
          },
          searchAssignment: {
            universalIdentifier: 'c1d2e3f4-a004-4c7d-8e9f-0a1b2c3d4004',
          },
          person: {
            universalIdentifier: 'c1d2e3f4-a005-4c7d-8e9f-0a1b2c3d4005',
          },
          assignedAt: {
            universalIdentifier: 'c1d2e3f4-a006-4c7d-8e9f-0a1b2c3d4006',
          },
          createdAt: {
            universalIdentifier: 'c1d2e3f4-a007-4c7d-8e9f-0a1b2c3d4007',
          },
        },
      },
      searchCandidacyRecordPageFields: {
        universalIdentifier: 'd1e2f3a4-b5c6-4d7e-8f9a-0b1c2d3e4f5a',
        viewFieldGroups: {
          general: {
            universalIdentifier: 'd1e2f3a4-b001-4d7e-8f9a-0b1c2d3e5000',
          },
        },
        viewFields: {
          name: { universalIdentifier: 'd1e2f3a4-c001-4d7e-8f9a-0b1c2d3e5001' },
          status: {
            universalIdentifier: 'd1e2f3a4-c002-4d7e-8f9a-0b1c2d3e5002',
          },
          currentStage: {
            universalIdentifier: 'd1e2f3a4-c003-4d7e-8f9a-0b1c2d3e5003',
          },
          searchAssignment: {
            universalIdentifier: 'd1e2f3a4-c004-4d7e-8f9a-0b1c2d3e5004',
          },
          person: {
            universalIdentifier: 'd1e2f3a4-c005-4d7e-8f9a-0b1c2d3e5005',
          },
          researchCandidate: {
            universalIdentifier: 'd1e2f3a4-c006-4d7e-8f9a-0b1c2d3e5006',
          },
          executiveProfile: {
            universalIdentifier: 'd1e2f3a4-c007-4d7e-8f9a-0b1c2d3e5007',
          },
          assignedAt: {
            universalIdentifier: 'd1e2f3a4-c008-4d7e-8f9a-0b1c2d3e5008',
          },
          lastStageChangedAt: {
            universalIdentifier: 'd1e2f3a4-c009-4d7e-8f9a-0b1c2d3e5009',
          },
          candidateConsentDate: {
            universalIdentifier: 'd1e2f3a4-c00a-4d7e-8f9a-0b1c2d3e500a',
          },
          closedAt: {
            universalIdentifier: 'd1e2f3a4-c00b-4d7e-8f9a-0b1c2d3e500b',
          },
          notes: {
            universalIdentifier: 'd1e2f3a4-c00c-4d7e-8f9a-0b1c2d3e500c',
          },
          createdAt: {
            universalIdentifier: 'd1e2f3a4-c00d-4d7e-8f9a-0b1c2d3e500d',
          },
          createdBy: {
            universalIdentifier: 'd1e2f3a4-c00e-4d7e-8f9a-0b1c2d3e500e',
          },
status: { universalIdentifier: 'd1e2f3a4-c002-4d7e-8f9a-0b1c2d3e5002' },
          currentStage: { universalIdentifier: 'd1e2f3a4-c003-4d7e-8f9a-0b1c2d3e5003' },
          searchAssignment: { universalIdentifier: 'd1e2f3a4-c004-4d7e-8f9a-0b1c2d3e5004' },
          person: { universalIdentifier: 'd1e2f3a4-c005-4d7e-8f9a-0b1c2d3e5005' },
          researchCandidate: { universalIdentifier: 'd1e2f3a4-c006-4d7e-8f9a-0b1c2d3e5006' },
          executiveProfile: { universalIdentifier: 'd1e2f3a4-c007-4d7e-8f9a-0b1c2d3e5007' },
          assignedAt: { universalIdentifier: 'd1e2f3a4-c008-4d7e-8f9a-0b1c2d3e5008' },
          lastStageChangedAt: { universalIdentifier: 'd1e2f3a4-c009-4d7e-8f9a-0b1c2d3e5009' },
          candidateConsentDate: { universalIdentifier: 'd1e2f3a4-c00a-4d7e-8f9a-0b1c2d3e500a' },
          closedAt: { universalIdentifier: 'd1e2f3a4-c00b-4d7e-8f9a-0b1c2d3e500b' },
          notes: { universalIdentifier: 'd1e2f3a4-c00c-4d7e-8f9a-0b1c2d3e500c' },
          createdAt: { universalIdentifier: 'd1e2f3a4-c00d-4d7e-8f9a-0b1c2d3e500d' },
          createdBy: { universalIdentifier: 'd1e2f3a4-c00e-4d7e-8f9a-0b1c2d3e500e' },
          name: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007001' },
          slateType: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007002' },
          version: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007003' },
          status: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007004' },
          submittedAt: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007005' },
          submittedBy: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007006' },
          clientNotes: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007007' },
          searchAssignment: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007008' },
          createdAt: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007009' },
          createdBy: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007010' },
        },
      },
    },
  },

  // Phase 9 — Assessment, Slates, Presentations
  executiveAssessment: {
  universalIdentifier: 'aeb1a001-0001-4000-8001-aeb1a0000001',
  fields: {
  ...buildStandardObjectSystemFields(
  'aeb1a001-0001-4000-8001-aeb1a0000001',
  ),
  name: { universalIdentifier: 'aeb1a001-0001-4000-8001-aeb1a0000101' },
  status: { universalIdentifier: 'aeb1a001-0001-4000-8001-aeb1a0000102' },
  overallAssessment: { universalIdentifier: 'aeb1a001-0001-4000-8001-aeb1a0000103' },
  strengthsSummary: { universalIdentifier: 'aeb1a001-0001-4000-8001-aeb1a0000104' },
  riskFactorsSummary: { universalIdentifier: 'aeb1a001-0001-4000-8001-aeb1a0000105' },
  recommendation: { universalIdentifier: 'aeb1a001-0001-4000-8001-aeb1a0000106' },
  assessmentDate: { universalIdentifier: 'aeb1a001-0001-4000-8001-aeb1a0000107' },
  assessor: { universalIdentifier: 'aeb1a001-0001-4000-8001-aeb1a0000108' },
  assessorId: { universalIdentifier: 'aeb1a001-0001-4000-8001-aeb1a0000109' },
  candidacy: { universalIdentifier: 'aeb1a001-0001-4000-8001-aeb1a0000110' },
  candidacyId: { universalIdentifier: 'aeb1a001-0001-4000-8001-aeb1a0000111' },
  searchAssignment: { universalIdentifier: 'aeb1a001-0001-4000-8001-aeb1a0000112' },
  searchAssignmentId: { universalIdentifier: 'aeb1a001-0001-4000-8001-aeb1a0000113' },
  consentToShare: { universalIdentifier: 'aeb1a001-0001-4000-8001-aeb1a0000114' },
  isClientVisible: { universalIdentifier: 'aeb1a001-0001-4000-8001-aeb1a0000115' },
  evaluations: { universalIdentifier: 'aeb1a001-0001-4000-8001-aeb1a0000116' },
  },
  indexes: {
  candidacyIdIndex: { universalIdentifier: 'aeb1a001-0002-4000-8001-aeb1a0001001' },
  searchAssignmentIdIndex: { universalIdentifier: 'aeb1a001-0002-4000-8001-aeb1a0001002' },
  statusIndex: { universalIdentifier: 'aeb1a001-0002-4000-8001-aeb1a0001003' },
  assessorIdIndex: { universalIdentifier: 'aeb1a001-0002-4000-8001-aeb1a0001004' },
  },
  views: {
  executiveAssessmentRecordPageFields: {
  universalIdentifier: 'aeb1a001-0030-4000-8001-aeb1a0002001',
  viewFieldGroups: {
  general: { universalIdentifier: 'aeb1a001-0040-4000-8001-aeb1a0003001' },
  },
  viewFields: {
  name: { universalIdentifier: 'aeb1a001-0050-4000-8001-aeb1a0004001' },
  status: { universalIdentifier: 'aeb1a001-0050-4000-8001-aeb1a0004002' },
  overallAssessment: { universalIdentifier: 'aeb1a001-0050-4000-8001-aeb1a0004003' },
  strengthsSummary: { universalIdentifier: 'aeb1a001-0050-4000-8001-aeb1a0004004' },
  riskFactorsSummary: { universalIdentifier: 'aeb1a001-0050-4000-8001-aeb1a0004005' },
  recommendation: { universalIdentifier: 'aeb1a001-0050-4000-8001-aeb1a0004006' },
  assessmentDate: { universalIdentifier: 'aeb1a001-0050-4000-8001-aeb1a0004007' },
  assessor: { universalIdentifier: 'aeb1a001-0050-4000-8001-aeb1a0004008' },
  candidacy: { universalIdentifier: 'aeb1a001-0050-4000-8001-aeb1a0004009' },
  searchAssignment: { universalIdentifier: 'aeb1a001-0050-4000-8001-aeb1a0004010' },
  createdAt: { universalIdentifier: 'aeb1a001-0050-4000-8001-aeb1a0004011' },
  createdBy: { universalIdentifier: 'aeb1a001-0050-4000-8001-aeb1a0004012' },
  },
  },
  },
  },
  ,
  criterionEvaluation: {
  universalIdentifier: 'aeb1a002-0001-4000-8002-aeb1a0000002',
  fields: {
  ...buildStandardObjectSystemFields(
  'aeb1a002-0001-4000-8002-aeb1a0000002',
  ),
  name: { universalIdentifier: 'aeb1a002-0001-4000-8002-aeb1a0000201' },
  rating: { universalIdentifier: 'aeb1a002-0001-4000-8002-aeb1a0000202' },
  evidenceSummary: { universalIdentifier: 'aeb1a002-0001-4000-8002-aeb1a0000203' },
  evidenceReferences: { universalIdentifier: 'aeb1a002-0001-4000-8002-aeb1a0000204' },
  aiDraft: { universalIdentifier: 'aeb1a002-0001-4000-8002-aeb1a0000205' },
  aiDraftGeneratedAt: { universalIdentifier: 'aeb1a002-0001-4000-8002-aeb1a0000206' },
  aiModelVersion: { universalIdentifier: 'aeb1a002-0001-4000-8002-aeb1a0000207' },
  isHumanReviewed: { universalIdentifier: 'aeb1a002-0001-4000-8002-aeb1a0000208' },
  assessorNotes: { universalIdentifier: 'aeb1a002-0001-4000-8002-aeb1a0000209' },
  assessment: { universalIdentifier: 'aeb1a002-0001-4000-8002-aeb1a0000210' },
  assessmentId: { universalIdentifier: 'aeb1a002-0001-4000-8002-aeb1a0000211' },
  criterion: { universalIdentifier: 'aeb1a002-0001-4000-8002-aeb1a0000212' },
  criterionId: { universalIdentifier: 'aeb1a002-0001-4000-8002-aeb1a0000213' },
  candidacy: { universalIdentifier: 'aeb1a002-0001-4000-8002-aeb1a0000214' },
  candidacyId: { universalIdentifier: 'aeb1a002-0001-4000-8002-aeb1a0000215' },
  },
  indexes: {
  assessmentIdIndex: { universalIdentifier: 'aeb1a002-0002-4000-8002-aeb1a0002001' },
  criterionIdIndex: { universalIdentifier: 'aeb1a002-0002-4000-8002-aeb1a0002002' },
  candidacyIdIndex: { universalIdentifier: 'aeb1a002-0002-4000-8002-aeb1a0002003' },
  },
  views: {
  criterionEvaluationRecordPageFields: {
  universalIdentifier: 'aeb1a002-0030-4000-8002-aeb1a0004001',
  viewFieldGroups: {
  general: { universalIdentifier: 'aeb1a002-0040-4000-8002-aeb1a0005001' },
  },
  viewFields: {
  name: { universalIdentifier: 'aeb1a002-0050-4000-8002-aeb1a0006001' },
  rating: { universalIdentifier: 'aeb1a002-0050-4000-8002-aeb1a0006002' },
  evidenceSummary: { universalIdentifier: 'aeb1a002-0050-4000-8002-aeb1a0006003' },
  isHumanReviewed: { universalIdentifier: 'aeb1a002-0050-4000-8002-aeb1a0006004' },
  assessment: { universalIdentifier: 'aeb1a002-0050-4000-8002-aeb1a0006005' },
  criterion: { universalIdentifier: 'aeb1a002-0050-4000-8002-aeb1a0006006' },
  candidacy: { universalIdentifier: 'aeb1a002-0050-4000-8002-aeb1a0006007' },
  createdAt: { universalIdentifier: 'aeb1a002-0050-4000-8002-aeb1a0006008' },
  createdBy: { universalIdentifier: 'aeb1a002-0050-4000-8002-aeb1a0006009' },
  },
  },
  },
  },
  ,
  searchSlate: {
  universalIdentifier: 'aeb1a003-0001-4000-8003-aeb1a0000003',
  fields: {
  ...buildStandardObjectSystemFields(
  'aeb1a003-0001-4000-8003-aeb1a0000003',
  ),
  name: { universalIdentifier: 'aeb1a003-0001-4000-8003-aeb1a0000301' },
  slateType: { universalIdentifier: 'aeb1a003-0001-4000-8003-aeb1a0000302' },
  version: { universalIdentifier: 'aeb1a003-0001-4000-8003-aeb1a0000303' },
  status: { universalIdentifier: 'aeb1a003-0001-4000-8003-aeb1a0000304' },
  submittedAt: { universalIdentifier: 'aeb1a003-0001-4000-8003-aeb1a0000305' },
  submittedBy: { universalIdentifier: 'aeb1a003-0001-4000-8003-aeb1a0000306' },
  submittedById: { universalIdentifier: 'aeb1a003-0001-4000-8003-aeb1a0000307' },
  clientNotes: { universalIdentifier: 'aeb1a003-0001-4000-8003-aeb1a0000308' },
  searchAssignment: { universalIdentifier: 'aeb1a003-0001-4000-8003-aeb1a0000309' },
  searchAssignmentId: { universalIdentifier: 'aeb1a003-0001-4000-8003-aeb1a0000310' },
  },
  indexes: {
  searchAssignmentIdIndex: { universalIdentifier: 'aeb1a003-0002-4000-8003-aeb1a0003001' },
  statusIndex: { universalIdentifier: 'aeb1a003-0002-4000-8003-aeb1a0003002' },
  slateTypeIndex: { universalIdentifier: 'aeb1a003-0002-4000-8003-aeb1a0003003' },
  },
  views: {
  searchSlateRecordPageFields: {
  universalIdentifier: 'aeb1a003-0030-4000-8003-aeb1a0005001',
  viewFieldGroups: {
  general: { universalIdentifier: 'aeb1a003-0040-4000-8003-aeb1a0006001' },
  },
  viewFields: {
  name: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007001' },
  slateType: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007002' },
  version: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007003' },
  status: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007004' },
  submittedAt: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007005' },
  submittedBy: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007006' },
  clientNotes: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007007' },
  searchAssignment: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007008' },
  createdAt: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007009' },
  createdBy: { universalIdentifier: 'aeb1a003-0050-4000-8003-aeb1a0007010' },
  },
  },
  },
  },
  ,
  slateMembership: {
  universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000004',
  fields: {
  ...buildStandardObjectSystemFields(
  'aeb1a004-0001-4000-8004-aeb1a0000004',
  ),
  name: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000401' },
  position: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000402' },
  status: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000403' },
  presentationConsentObtained: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000404' },
  consentObtainedAt: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000405' },
  consentExpiresAt: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000406' },
  consentMethod: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000407' },
  slate: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000408' },
  slateId: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000409' },
  candidacy: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000410' },
  candidacyId: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000411' },
  },
  indexes: {
  slateIdIndex: { universalIdentifier: 'aeb1a004-0002-4000-8004-aeb1a0004001' },
  candidacyIdIndex: { universalIdentifier: 'aeb1a004-0002-4000-8004-aeb1a0004002' },
  statusIndex: { universalIdentifier: 'aeb1a004-0002-4000-8004-aeb1a0004003' },
  },
  views: {
  slateMembershipRecordPageFields: {
  universalIdentifier: 'aeb1a004-0030-4000-8004-aeb1a0006001',
  viewFieldGroups: {
  general: { universalIdentifier: 'aeb1a004-0040-4000-8004-aeb1a0007001' },
  },
  viewFields: {
  name: { universalIdentifier: 'aeb1a004-0050-4000-8004-aeb1a0008001' },
  position: { universalIdentifier: 'aeb1a004-0050-4000-8004-aeb1a0008002' },
  status: { universalIdentifier: 'aeb1a004-0050-4000-8004-aeb1a0008003' },
  presentationConsentObtained: { universalIdentifier: 'aeb1a004-0050-4000-8004-aeb1a0008004' },
  slate: { universalIdentifier: 'aeb1a004-0050-4000-8004-aeb1a0008005' },
  candidacy: { universalIdentifier: 'aeb1a004-0050-4000-8004-aeb1a0008006' },
  createdAt: { universalIdentifier: 'aeb1a004-0050-4000-8004-aeb1a0008007' },
  createdBy: { universalIdentifier: 'aeb1a004-0050-4000-8004-aeb1a0008008' },
  },
  },
  },
  },
  ,
  candidatePresentation: {
  universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000005',
  fields: {
  ...buildStandardObjectSystemFields(
  'aeb1a005-0001-4000-8005-aeb1a0000005',
  ),
  name: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000501' },
  version: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000502' },
  status: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000503' },
  sourceSnapshot: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000504' },
  restrictedFieldLeakageScanResult: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000505' },
  reviewer: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000506' },
  reviewerId: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000507' },
  reviewedAt: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000508' },
  reviewDecision: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000509' },
  approvedAt: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000510' },
  publishedAt: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000511' },
  slateMembership: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000512' },
  slateMembershipId: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000513' },
  candidacy: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000514' },
  candidacyId: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000515' },
  searchAssignment: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000516' },
  searchAssignmentId: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000517' },
  },
  indexes: {
  slateMembershipIdIndex: { universalIdentifier: 'aeb1a005-0002-4000-8005-aeb1a0005001' },
  candidacyIdIndex: { universalIdentifier: 'aeb1a005-0002-4000-8005-aeb1a0005002' },
  searchAssignmentIdIndex: { universalIdentifier: 'aeb1a005-0002-4000-8005-aeb1a0005003' },
  statusIndex: { universalIdentifier: 'aeb1a005-0002-4000-8005-aeb1a0005004' },
  },
  views: {
  candidatePresentationRecordPageFields: {
  universalIdentifier: 'aeb1a005-0030-4000-8005-aeb1a0007001',
  viewFieldGroups: {
  general: { universalIdentifier: 'aeb1a005-0040-4000-8005-aeb1a0008001' },
  },
  viewFields: {
  name: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009001' },
  version: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009002' },
  status: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009003' },
  reviewDecision: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009004' },
  reviewedAt: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009005' },
  reviewer: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009006' },
  slateMembership: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009007' },
  candidacy: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009008' },
  searchAssignment: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009009' },
  createdAt: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009010' },
  createdBy: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009011' },
  },
  },
  },
  },
  ,
  clientFeedback: {
  universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000006',
  fields: {
  ...buildStandardObjectSystemFields(
  'aeb1a006-0001-4000-8006-aeb1a0000006',
  ),
  name: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000601' },
  feedbackType: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000602' },
  rating: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000603' },
  comments: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000604' },
  receivedAt: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000605' },
  receivedFrom: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000606' },
  isSharedWithCandidate: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000607' },
  sharedWithCandidateAt: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000608' },
  candidacy: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000609' },
  candidacyId: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000610' },
  slate: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000611' },
  slateId: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000612' },
  presentation: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000613' },
  presentationId: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000614' },
  searchAssignment: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000615' },
  searchAssignmentId: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000616' },
  },
  indexes: {
  candidacyIdIndex: { universalIdentifier: 'aeb1a006-0002-4000-8006-aeb1a0006001' },
  slateIdIndex: { universalIdentifier: 'aeb1a006-0002-4000-8006-aeb1a0006002' },
  presentationIdIndex: { universalIdentifier: 'aeb1a006-0002-4000-8006-aeb1a0006003' },
  searchAssignmentIdIndex: { universalIdentifier: 'aeb1a006-0002-4000-8006-aeb1a0006004' },
  },
  views: {
  clientFeedbackRecordPageFields: {
  universalIdentifier: 'aeb1a006-0030-4000-8006-aeb1a0008001',
  viewFieldGroups: {
  general: { universalIdentifier: 'aeb1a006-0040-4000-8006-aeb1a0009001' },
  },
  viewFields: {
  name: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010001' },
  feedbackType: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010002' },
  rating: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010003' },
  comments: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010004' },
  receivedAt: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010005' },
  receivedFrom: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010006' },
  candidacy: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010007' },
  slate: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010008' },
  presentation: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010009' },
  searchAssignment: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010010' },
  createdAt: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010011' },
  createdBy: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010012' },
  },
  },
  },
  },
  ,
  searchStatusReport: {
  universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000007',
  fields: {
  ...buildStandardObjectSystemFields(
  'aeb1a007-0001-4000-8007-aeb1a0000007',
  ),
  name: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000701' },
  reportType: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000702' },
  status: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000703' },
  reportDate: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000704' },
  periodStart: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000705' },
  periodEnd: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000706' },
  activitiesSummary: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000707' },
  candidatePipelineSummary: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000708' },
  nextSteps: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000709' },
  clientFeedbackRequested: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000710' },
  submittedBy: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000711' },
  submittedById: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000712' },
  acknowledgedBy: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000713' },
  acknowledgedById: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000714' },
  searchAssignment: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000715' },
  searchAssignmentId: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000716' },
  },
  indexes: {
  searchAssignmentIdIndex: { universalIdentifier: 'aeb1a007-0002-4000-8007-aeb1a0007001' },
  statusIndex: { universalIdentifier: 'aeb1a007-0002-4000-8007-aeb1a0007002' },
  reportTypeIndex: { universalIdentifier: 'aeb1a007-0002-4000-8007-aeb1a0007003' },
  reportDateIndex: { universalIdentifier: 'aeb1a007-0002-4000-8007-aeb1a0007004' },
  },
  views: {
  searchStatusReportRecordPageFields: {
  universalIdentifier: 'aeb1a007-0030-4000-8007-aeb1a0009001',
  viewFieldGroups: {
  general: { universalIdentifier: 'aeb1a007-0040-4000-8007-aeb1a0010001' },
  },
  viewFields: {
  name: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011001' },
  reportType: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011002' },
  status: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011003' },
  reportDate: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011004' },
  periodStart: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011005' },
  periodEnd: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011006' },
  activitiesSummary: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011007' },
  submittedBy: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011008' },
  searchAssignment: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011009' },
  createdAt: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011010' },
  createdBy: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011011' },
  },
  },
  },
  },
  ,
slateMembership: {
    universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000004',
    fields: {
      ...buildStandardObjectSystemFields(
        'aeb1a004-0001-4000-8004-aeb1a0000004',
      ),
      name: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000401' },
      position: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000402' },
      status: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000403' },
      presentationConsentObtained: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000404' },
      consentObtainedAt: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000405' },
      consentExpiresAt: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000406' },
      consentMethod: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000407' },
      slate: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000408' },
      slateId: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000409' },
      candidacy: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000410' },
      candidacyId: { universalIdentifier: 'aeb1a004-0001-4000-8004-aeb1a0000411' },
    },
    indexes: {
      slateIdIndex: { universalIdentifier: 'aeb1a004-0002-4000-8004-aeb1a0004001' },
      candidacyIdIndex: { universalIdentifier: 'aeb1a004-0002-4000-8004-aeb1a0004002' },
      statusIndex: { universalIdentifier: 'aeb1a004-0002-4000-8004-aeb1a0004003' },
    },
    views: {
      slateMembershipRecordPageFields: {
        universalIdentifier: 'aeb1a004-0030-4000-8004-aeb1a0006001',
        viewFieldGroups: {
          general: { universalIdentifier: 'aeb1a004-0040-4000-8004-aeb1a0007001' },
        },
        viewFields: {
          name: { universalIdentifier: 'aeb1a004-0050-4000-8004-aeb1a0008001' },
          position: { universalIdentifier: 'aeb1a004-0050-4000-8004-aeb1a0008002' },
          status: { universalIdentifier: 'aeb1a004-0050-4000-8004-aeb1a0008003' },
          presentationConsentObtained: { universalIdentifier: 'aeb1a004-0050-4000-8004-aeb1a0008004' },
          slate: { universalIdentifier: 'aeb1a004-0050-4000-8004-aeb1a0008005' },
          candidacy: { universalIdentifier: 'aeb1a004-0050-4000-8004-aeb1a0008006' },
          createdAt: { universalIdentifier: 'aeb1a004-0050-4000-8004-aeb1a0008007' },
          createdBy: { universalIdentifier: 'aeb1a004-0050-4000-8004-aeb1a0008008' },
        },
      },
    },
  },

  candidatePresentation: {
    universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000005',
    fields: {
      ...buildStandardObjectSystemFields(
        'aeb1a005-0001-4000-8005-aeb1a0000005',
      ),
      name: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000501' },
      version: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000502' },
      status: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000503' },
      sourceSnapshot: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000504' },
      restrictedFieldLeakageScanResult: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000505' },
      reviewer: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000506' },
      reviewerId: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000507' },
      reviewedAt: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000508' },
      reviewDecision: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000509' },
      approvedAt: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000510' },
      publishedAt: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000511' },
      slateMembership: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000512' },
      slateMembershipId: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000513' },
      candidacy: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000514' },
      candidacyId: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000515' },
      searchAssignment: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000516' },
      searchAssignmentId: { universalIdentifier: 'aeb1a005-0001-4000-8005-aeb1a0000517' },
    },
    indexes: {
      slateMembershipIdIndex: { universalIdentifier: 'aeb1a005-0002-4000-8005-aeb1a0005001' },
      candidacyIdIndex: { universalIdentifier: 'aeb1a005-0002-4000-8005-aeb1a0005002' },
      searchAssignmentIdIndex: { universalIdentifier: 'aeb1a005-0002-4000-8005-aeb1a0005003' },
      statusIndex: { universalIdentifier: 'aeb1a005-0002-4000-8005-aeb1a0005004' },
    },
    views: {
      candidatePresentationRecordPageFields: {
        universalIdentifier: 'aeb1a005-0030-4000-8005-aeb1a0007001',
        viewFieldGroups: {
          general: { universalIdentifier: 'aeb1a005-0040-4000-8005-aeb1a0008001' },
        },
        viewFields: {
          name: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009001' },
          version: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009002' },
          status: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009003' },
          reviewDecision: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009004' },
          reviewedAt: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009005' },
          reviewer: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009006' },
          slateMembership: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009007' },
          candidacy: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009008' },
          searchAssignment: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009009' },
          createdAt: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009010' },
          createdBy: { universalIdentifier: 'aeb1a005-0050-4000-8005-aeb1a0009011' },
        },
      },
    },
  },

  clientFeedback: {
    universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000006',
    fields: {
      ...buildStandardObjectSystemFields(
        'aeb1a006-0001-4000-8006-aeb1a0000006',
      ),
      name: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000601' },
      feedbackType: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000602' },
      rating: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000603' },
      comments: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000604' },
      receivedAt: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000605' },
      receivedFrom: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000606' },
      isSharedWithCandidate: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000607' },
      sharedWithCandidateAt: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000608' },
      candidacy: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000609' },
      candidacyId: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000610' },
      slate: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000611' },
      slateId: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000612' },
      presentation: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000613' },
      presentationId: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000614' },
      searchAssignment: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000615' },
      searchAssignmentId: { universalIdentifier: 'aeb1a006-0001-4000-8006-aeb1a0000616' },
    },
    indexes: {
      candidacyIdIndex: { universalIdentifier: 'aeb1a006-0002-4000-8006-aeb1a0006001' },
      slateIdIndex: { universalIdentifier: 'aeb1a006-0002-4000-8006-aeb1a0006002' },
      presentationIdIndex: { universalIdentifier: 'aeb1a006-0002-4000-8006-aeb1a0006003' },
      searchAssignmentIdIndex: { universalIdentifier: 'aeb1a006-0002-4000-8006-aeb1a0006004' },
    },
    views: {
      clientFeedbackRecordPageFields: {
        universalIdentifier: 'aeb1a006-0030-4000-8006-aeb1a0008001',
        viewFieldGroups: {
          general: { universalIdentifier: 'aeb1a006-0040-4000-8006-aeb1a0009001' },
        },
        viewFields: {
          name: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010001' },
          feedbackType: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010002' },
          rating: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010003' },
          comments: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010004' },
          receivedAt: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010005' },
          receivedFrom: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010006' },
          candidacy: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010007' },
          slate: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010008' },
          presentation: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010009' },
          searchAssignment: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010010' },
          createdAt: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010011' },
          createdBy: { universalIdentifier: 'aeb1a006-0050-4000-8006-aeb1a0010012' },
        },
      },
    },
  },

  searchStatusReport: {
    universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000007',
    fields: {
      ...buildStandardObjectSystemFields(
        'aeb1a007-0001-4000-8007-aeb1a0000007',
      ),
      name: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000701' },
      reportType: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000702' },
      status: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000703' },
      reportDate: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000704' },
      periodStart: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000705' },
      periodEnd: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000706' },
      activitiesSummary: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000707' },
      candidatePipelineSummary: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000708' },
      nextSteps: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000709' },
      clientFeedbackRequested: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000710' },
      submittedBy: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000711' },
      submittedById: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000712' },
      acknowledgedBy: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000713' },
      acknowledgedById: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000714' },
      searchAssignment: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000715' },
      searchAssignmentId: { universalIdentifier: 'aeb1a007-0001-4000-8007-aeb1a0000716' },
    },
    indexes: {
      searchAssignmentIdIndex: { universalIdentifier: 'aeb1a007-0002-4000-8007-aeb1a0007001' },
      statusIndex: { universalIdentifier: 'aeb1a007-0002-4000-8007-aeb1a0007002' },
      reportTypeIndex: { universalIdentifier: 'aeb1a007-0002-4000-8007-aeb1a0007003' },
      reportDateIndex: { universalIdentifier: 'aeb1a007-0002-4000-8007-aeb1a0007004' },
    },
    views: {
      searchStatusReportRecordPageFields: {
        universalIdentifier: 'aeb1a007-0030-4000-8007-aeb1a0009001',
        viewFieldGroups: {
          general: { universalIdentifier: 'aeb1a007-0040-4000-8007-aeb1a0010001' },
        },
        viewFields: {
          name: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011001' },
          reportType: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011002' },
          status: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011003' },
          reportDate: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011004' },
          periodStart: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011005' },
          periodEnd: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011006' },
          activitiesSummary: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011007' },
          submittedBy: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011008' },
          searchAssignment: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011009' },
          createdAt: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011010' },
          createdBy: { universalIdentifier: 'aeb1a007-0050-4000-8007-aeb1a0011011' },
        },
      },
    },
  },
  compensationExpectation: {
    universalIdentifier: 'a1a1b2b2-c0e1-4a01-8c01-ac11e0000001',
    fields: {
      ...buildStandardObjectSystemFields(
        'a1a1b2b2-c0e1-4a01-8c01-ac11e0000001',
      ),
      name: { universalIdentifier: 'a1a1b2b2-e001-4a01-8c01-ac11e000e001' },
      expectedBaseSalary: { universalIdentifier: 'a1a1b2b2-e002-4a01-8c01-ac11e000e002' },
      expectedTotalCompensation: { universalIdentifier: 'a1a1b2b2-e003-4a01-8c01-ac11e000e003' },
      expectedEquity: { universalIdentifier: 'a1a1b2b2-e004-4a01-8c01-ac11e000e004' },
      expectedBonus: { universalIdentifier: 'a1a1b2b2-e005-4a01-8c01-ac11e000e005' },
      currencyCode: { universalIdentifier: 'a1a1b2b2-e006-4a01-8c01-ac11e000e006' },
      expectationSource: { universalIdentifier: 'a1a1b2b2-e007-4a01-8c01-ac11e000e007' },
      notes: { universalIdentifier: 'a1a1b2b2-e008-4a01-8c01-ac11e000e008' },
      isVerifiedWithCandidate: { universalIdentifier: 'a1a1b2b2-e009-4a01-8c01-ac11e000e009' },
      verifiedAt: { universalIdentifier: 'a1a1b2b2-e00a-4a01-8c01-ac11e000e00a' },
      candidacy: { universalIdentifier: 'a1a1b2b2-e00b-4a01-8c01-ac11e000e00b' },
      candidacyId: { universalIdentifier: 'a1a1b2b2-e00c-4a01-8c01-ac11e000e00c' },
      searchAssignment: { universalIdentifier: 'a1a1b2b2-e00d-4a01-8c01-ac11e000e00d' },
      searchAssignmentId: { universalIdentifier: 'a1a1b2b2-e00e-4a01-8c01-ac11e000e00e' },
    },
    indexes: {
      candidacyIdIndex: { universalIdentifier: 'a1a1b2b2-f001-4a01-8c01-ac11e000f001' },
      searchAssignmentIdIndex: { universalIdentifier: 'a1a1b2b2-f002-4a01-8c01-ac11e000f002' },
    },
    views: {
      compensationExpectationRecordPageFields: {
        universalIdentifier: 'a1a1b2b2-d001-4a01-8c01-ac11e000d001',
        viewFieldGroups: {
          general: { universalIdentifier: 'a1a1b2b2-d101-4a01-8c01-ac11e000d101' },
          system: { universalIdentifier: 'a1a1b2b2-d102-4a01-8c01-ac11e000d102' },
        },
        viewFields: {
          name: { universalIdentifier: 'a1a1b2b2-c001-4a01-8c01-ac11e000c001' },
          expectedBaseSalary: { universalIdentifier: 'a1a1b2b2-c002-4a01-8c01-ac11e000c002' },
          expectedTotalCompensation: { universalIdentifier: 'a1a1b2b2-c003-4a01-8c01-ac11e000c003' },
          expectedEquity: { universalIdentifier: 'a1a1b2b2-c004-4a01-8c01-ac11e000c004' },
          expectedBonus: { universalIdentifier: 'a1a1b2b2-c005-4a01-8c01-ac11e000c005' },
          currencyCode: { universalIdentifier: 'a1a1b2b2-c006-4a01-8c01-ac11e000c006' },
          expectationSource: { universalIdentifier: 'a1a1b2b2-c007-4a01-8c01-ac11e000c007' },
          isVerifiedWithCandidate: { universalIdentifier: 'a1a1b2b2-c008-4a01-8c01-ac11e000c008' },
          verifiedAt: { universalIdentifier: 'a1a1b2b2-c009-4a01-8c01-ac11e000c009' },
          candidacy: { universalIdentifier: 'a1a1b2b2-c00a-4a01-8c01-ac11e000c00a' },
          searchAssignment: { universalIdentifier: 'a1a1b2b2-c00b-4a01-8c01-ac11e000c00b' },
          notes: { universalIdentifier: 'a1a1b2b2-c00c-4a01-8c01-ac11e000c00c' },
          createdAt: { universalIdentifier: 'a1a1b2b2-c00d-4a01-8c01-ac11e000c00d' },
          createdBy: { universalIdentifier: 'a1a1b2b2-c00e-4a01-8c01-ac11e000c00e' },
        },
      },
    },
  },
  offerNegotiation: {
    universalIdentifier: 'b2b2c3c3-c0e2-4a02-8c02-ac11e0000001',
    fields: {
      ...buildStandardObjectSystemFields(
        'b2b2c3c3-c0e2-4a02-8c02-ac11e0000001',
      ),
      name: { universalIdentifier: 'b2b2c3c3-e001-4a02-8c02-ac11e000e001' },
      status: { universalIdentifier: 'b2b2c3c3-e002-4a02-8c02-ac11e000e002' },
      offerAmount: { universalIdentifier: 'b2b2c3c3-e003-4a02-8c02-ac11e000e003' },
      currencyCode: { universalIdentifier: 'b2b2c3c3-e004-4a02-8c02-ac11e000e004' },
      equityTerms: { universalIdentifier: 'b2b2c3c3-e005-4a02-8c02-ac11e000e005' },
      bonusTerms: { universalIdentifier: 'b2b2c3c3-e006-4a02-8c02-ac11e000e006' },
      otherBenefits: { universalIdentifier: 'b2b2c3c3-e007-4a02-8c02-ac11e000e007' },
      proposedStartDate: { universalIdentifier: 'b2b2c3c3-e008-4a02-8c02-ac11e000e008' },
      offerLetterSentAt: { universalIdentifier: 'b2b2c3c3-e009-4a02-8c02-ac11e000e009' },
      offerLetterUrl: { universalIdentifier: 'b2b2c3c3-e00a-4a02-8c02-ac11e000e00a' },
      acceptedAt: { universalIdentifier: 'b2b2c3c3-e00b-4a02-8c02-ac11e000e00b' },
      acceptedSalary: { universalIdentifier: 'b2b2c3c3-e00c-4a02-8c02-ac11e000e00c' },
      acceptedTotalCompensation: { universalIdentifier: 'b2b2c3c3-e00d-4a02-8c02-ac11e000e00d' },
      declinedReason: { universalIdentifier: 'b2b2c3c3-e00e-4a02-8c02-ac11e000e00e' },
      notes: { universalIdentifier: 'b2b2c3c3-e00f-4a02-8c02-ac11e000e00f' },
      candidacy: { universalIdentifier: 'b2b2c3c3-e010-4a02-8c02-ac11e000e010' },
      candidacyId: { universalIdentifier: 'b2b2c3c3-e011-4a02-8c02-ac11e000e011' },
      searchAssignment: { universalIdentifier: 'b2b2c3c3-e012-4a02-8c02-ac11e000e012' },
      searchAssignmentId: { universalIdentifier: 'b2b2c3c3-e013-4a02-8c02-ac11e000e013' },
      compensationExpectation: { universalIdentifier: 'b2b2c3c3-e014-4a02-8c02-ac11e000e014' },
      compensationExpectationId: { universalIdentifier: 'b2b2c3c3-e015-4a02-8c02-ac11e000e015' },
    },
    indexes: {
      candidacyIdIndex: { universalIdentifier: 'b2b2c3c3-f001-4a02-8c02-ac11e000f001' },
      searchAssignmentIdIndex: { universalIdentifier: 'b2b2c3c3-f002-4a02-8c02-ac11e000f002' },
      compensationExpectationIdIndex: { universalIdentifier: 'b2b2c3c3-f003-4a02-8c02-ac11e000f003' },
    },
    views: {
      offerNegotiationRecordPageFields: {
        universalIdentifier: 'b2b2c3c3-d001-4a02-8c02-ac11e000d001',
        viewFieldGroups: {
          general: { universalIdentifier: 'b2b2c3c3-d101-4a02-8c02-ac11e000d101' },
          system: { universalIdentifier: 'b2b2c3c3-d102-4a02-8c02-ac11e000d102' },
        },
        viewFields: {
          name: { universalIdentifier: 'b2b2c3c3-c001-4a02-8c02-ac11e000c001' },
          status: { universalIdentifier: 'b2b2c3c3-c002-4a02-8c02-ac11e000c002' },
          offerAmount: { universalIdentifier: 'b2b2c3c3-c003-4a02-8c02-ac11e000c003' },
          currencyCode: { universalIdentifier: 'b2b2c3c3-c004-4a02-8c02-ac11e000c004' },
          equityTerms: { universalIdentifier: 'b2b2c3c3-c005-4a02-8c02-ac11e000c005' },
          bonusTerms: { universalIdentifier: 'b2b2c3c3-c006-4a02-8c02-ac11e000c006' },
          proposedStartDate: { universalIdentifier: 'b2b2c3c3-c007-4a02-8c02-ac11e000c007' },
          acceptedSalary: { universalIdentifier: 'b2b2c3c3-c008-4a02-8c02-ac11e000c008' },
          acceptedTotalCompensation: { universalIdentifier: 'b2b2c3c3-c009-4a02-8c02-ac11e000c009' },
          candidacy: { universalIdentifier: 'b2b2c3c3-c00a-4a02-8c02-ac11e000c00a' },
          searchAssignment: { universalIdentifier: 'b2b2c3c3-c00b-4a02-8c02-ac11e000c00b' },
          compensationExpectation: { universalIdentifier: 'b2b2c3c3-c00c-4a02-8c02-ac11e000c00c' },
          createdAt: { universalIdentifier: 'b2b2c3c3-c00d-4a02-8c02-ac11e000c00d' },
          createdBy: { universalIdentifier: 'b2b2c3c3-c00e-4a02-8c02-ac11e000c00e' },
        },
      },
    },
  },
  placement: {
    universalIdentifier: 'c3c3d4d4-c0e3-4a03-8c03-ac11e0000001',
    fields: {
      ...buildStandardObjectSystemFields(
        'c3c3d4d4-c0e3-4a03-8c03-ac11e0000001',
      ),
      name: { universalIdentifier: 'c3c3d4d4-e001-4a03-8c03-ac11e000e001' },
      status: { universalIdentifier: 'c3c3d4d4-e002-4a03-8c03-ac11e000e002' },
      placementDate: { universalIdentifier: 'c3c3d4d4-e003-4a03-8c03-ac11e000e003' },
      startDate: { universalIdentifier: 'c3c3d4d4-e004-4a03-8c03-ac11e000e004' },
      endDate: { universalIdentifier: 'c3c3d4d4-e005-4a03-8c03-ac11e000e005' },
      feeAmount: { universalIdentifier: 'c3c3d4d4-e006-4a03-8c03-ac11e000e006' },
      feeCurrencyCode: { universalIdentifier: 'c3c3d4d4-e007-4a03-8c03-ac11e000e007' },
      feeType: { universalIdentifier: 'c3c3d4d4-e008-4a03-8c03-ac11e000e008' },
      feeCalculation: { universalIdentifier: 'c3c3d4d4-e009-4a03-8c03-ac11e000e009' },
      commissionableAmount: { universalIdentifier: 'c3c3d4d4-e00a-4a03-8c03-ac11e000e00a' },
      invoiceReference: { universalIdentifier: 'c3c3d4d4-e00b-4a03-8c03-ac11e000e00b' },
      guaranteePeriodMonths: { universalIdentifier: 'c3c3d4d4-e00c-4a03-8c03-ac11e000e00c' },
      guaranteeEndDate: { universalIdentifier: 'c3c3d4d4-e00d-4a03-8c03-ac11e000e00d' },
      billingContact: { universalIdentifier: 'c3c3d4d4-e00e-4a03-8c03-ac11e000e00e' },
      billingContactId: { universalIdentifier: 'c3c3d4d4-e00f-4a03-8c03-ac11e000e00f' },
      placementConfirmedBy: { universalIdentifier: 'c3c3d4d4-e010-4a03-8c03-ac11e000e010' },
      placementConfirmedById: { universalIdentifier: 'c3c3d4d4-e011-4a03-8c03-ac11e000e011' },
      candidacy: { universalIdentifier: 'c3c3d4d4-e012-4a03-8c03-ac11e000e012' },
      candidacyId: { universalIdentifier: 'c3c3d4d4-e013-4a03-8c03-ac11e000e013' },
      offerNegotiation: { universalIdentifier: 'c3c3d4d4-e014-4a03-8c03-ac11e000e014' },
      offerNegotiationId: { universalIdentifier: 'c3c3d4d4-e015-4a03-8c03-ac11e000e015' },
      searchAssignment: { universalIdentifier: 'c3c3d4d4-e016-4a03-8c03-ac11e000e016' },
      searchAssignmentId: { universalIdentifier: 'c3c3d4d4-e017-4a03-8c03-ac11e000e017' },
    },
    indexes: {
      candidacyIdIndex: { universalIdentifier: 'c3c3d4d4-f001-4a03-8c03-ac11e000f001' },
      searchAssignmentIdIndex: { universalIdentifier: 'c3c3d4d4-f002-4a03-8c03-ac11e000f002' },
      offerNegotiationIdIndex: { universalIdentifier: 'c3c3d4d4-f003-4a03-8c03-ac11e000f003' },
    },
    views: {
      placementRecordPageFields: {
        universalIdentifier: 'c3c3d4d4-d001-4a03-8c03-ac11e000d001',
        viewFieldGroups: {
          general: { universalIdentifier: 'c3c3d4d4-d101-4a03-8c03-ac11e000d101' },
          system: { universalIdentifier: 'c3c3d4d4-d102-4a03-8c03-ac11e000d102' },
        },
        viewFields: {
          name: { universalIdentifier: 'c3c3d4d4-c001-4a03-8c03-ac11e000c001' },
          status: { universalIdentifier: 'c3c3d4d4-c002-4a03-8c03-ac11e000c002' },
          placementDate: { universalIdentifier: 'c3c3d4d4-c003-4a03-8c03-ac11e000c003' },
          startDate: { universalIdentifier: 'c3c3d4d4-c004-4a03-8c03-ac11e000c004' },
          feeAmount: { universalIdentifier: 'c3c3d4d4-c005-4a03-8c03-ac11e000c005' },
          feeCurrencyCode: { universalIdentifier: 'c3c3d4d4-c006-4a03-8c03-ac11e000c006' },
          invoiceReference: { universalIdentifier: 'c3c3d4d4-c007-4a03-8c03-ac11e000c007' },
          guaranteePeriodMonths: { universalIdentifier: 'c3c3d4d4-c008-4a03-8c03-ac11e000c008' },
          guaranteeEndDate: { universalIdentifier: 'c3c3d4d4-c009-4a03-8c03-ac11e000c009' },
          billingContact: { universalIdentifier: 'c3c3d4d4-c00a-4a03-8c03-ac11e000c00a' },
          candidacy: { universalIdentifier: 'c3c3d4d4-c00b-4a03-8c03-ac11e000c00b' },
          offerNegotiation: { universalIdentifier: 'c3c3d4d4-c00c-4a03-8c03-ac11e000c00c' },
          searchAssignment: { universalIdentifier: 'c3c3d4d4-c00d-4a03-8c03-ac11e000c00d' },
          createdAt: { universalIdentifier: 'c3c3d4d4-c00e-4a03-8c03-ac11e000c00e' },
          createdBy: { universalIdentifier: 'c3c3d4d4-c00f-4a03-8c03-ac11e000c00f' },
        },
      },
    },
  },

  searchInterview: {
    universalIdentifier: 'aeb1d000-0001-4000-800d-aeb1d0000001',
    fields: {
      ...buildStandardObjectSystemFields(
        'aeb1d000-0001-4000-800d-aeb1d0000001',
      ),
      name: { universalIdentifier: 'aeb1d000-0001-4000-800d-aeb1d000d001' },
      interviewType: { universalIdentifier: 'aeb1d000-0001-4000-800d-aeb1d000d002' },
      status: { universalIdentifier: 'aeb1d000-0001-4000-800d-aeb1d000d003' },
      scheduledDate: { universalIdentifier: 'aeb1d000-0001-4000-800d-aeb1d000d004' },
      scheduledEndDate: { universalIdentifier: 'aeb1d000-0001-4000-800d-aeb1d000d005' },
      duration: { universalIdentifier: 'aeb1d000-0001-4000-800d-aeb1d000d006' },
      location: { universalIdentifier: 'aeb1d000-0001-4000-800d-aeb1d000d007' },
      notes: { universalIdentifier: 'aeb1d000-0001-4000-800d-aeb1d000d008' },
      outcome: { universalIdentifier: 'aeb1d000-0001-4000-800d-aeb1d000d009' },
      internalNotes: { universalIdentifier: 'aeb1d000-0001-4000-800d-aeb1d000d010' },
      interviewers: { universalIdentifier: 'aeb1d000-0001-4000-800d-aeb1d000d011' },
      searchAssignment: { universalIdentifier: 'aeb1d000-0001-4000-800d-aeb1d000d012' },
      searchAssignmentId: { universalIdentifier: 'aeb1d000-0001-4000-800d-aeb1d000d013' },
      searchCandidacy: { universalIdentifier: 'aeb1d000-0001-4000-800d-aeb1d000d014' },
      searchCandidacyId: { universalIdentifier: 'aeb1d000-0001-4000-800d-aeb1d000d015' },
      clientFeedbacks: { universalIdentifier: 'aeb1d000-0001-4000-800d-aeb1d000d016' },
    },
    indexes: {
      searchAssignmentIdIndex: { universalIdentifier: 'aeb1d000-0002-4000-800d-aeb1d000i001' },
      searchCandidacyIdIndex: { universalIdentifier: 'aeb1d000-0002-4000-800d-aeb1d000i002' },
      statusIndex: { universalIdentifier: 'aeb1d000-0002-4000-800d-aeb1d000i003' },
      scheduledDateIndex: { universalIdentifier: 'aeb1d000-0002-4000-800d-aeb1d000i004' },
    },
    views: {
      searchInterviewRecordPageFields: {
        universalIdentifier: 'aeb1d000-0030-4000-800d-aeb1d000v001',
        viewFieldGroups: {
          general: { universalIdentifier: 'aeb1d000-0040-4000-800d-aeb1d000g001' },
          system: { universalIdentifier: 'aeb1d000-0040-4000-800d-aeb1d000g002' },
        },
        viewFields: {
          name: { universalIdentifier: 'aeb1d000-0050-4000-800d-aeb1d000f001' },
          interviewType: { universalIdentifier: 'aeb1d000-0050-4000-800d-aeb1d000f002' },
          status: { universalIdentifier: 'aeb1d000-0050-4000-800d-aeb1d000f003' },
          scheduledDate: { universalIdentifier: 'aeb1d000-0050-4000-800d-aeb1d000f004' },
          scheduledEndDate: { universalIdentifier: 'aeb1d000-0050-4000-800d-aeb1d000f005' },
          duration: { universalIdentifier: 'aeb1d000-0050-4000-800d-aeb1d000f006' },
          location: { universalIdentifier: 'aeb1d000-0050-4000-800d-aeb1d000f007' },
          notes: { universalIdentifier: 'aeb1d000-0050-4000-800d-aeb1d000f008' },
          outcome: { universalIdentifier: 'aeb1d000-0050-4000-800d-aeb1d000f009' },
          internalNotes: { universalIdentifier: 'aeb1d000-0050-4000-800d-aeb1d000f010' },
          interviewers: { universalIdentifier: 'aeb1d000-0050-4000-800d-aeb1d000f011' },
          searchAssignment: { universalIdentifier: 'aeb1d000-0050-4000-800d-aeb1d000f012' },
          searchCandidacy: { universalIdentifier: 'aeb1d000-0050-4000-800d-aeb1d000f013' },
          clientFeedbacks: { universalIdentifier: 'aeb1d000-0050-4000-800d-aeb1d000f014' },
          createdAt: { universalIdentifier: 'aeb1d000-0050-4000-800d-aeb1d000f015' },
          createdBy: { universalIdentifier: 'aeb1d000-0050-4000-800d-aeb1d000f016' },
        },
      },
    },
  },

  referenceCheck: {
    universalIdentifier: 'aeb1e000-0001-4000-800e-aeb1e0000001',
    fields: {
      ...buildStandardObjectSystemFields(
        'aeb1e000-0001-4000-800e-aeb1e0000001',
      ),
      name: { universalIdentifier: 'aeb1e000-0001-4000-800e-aeb1e000e001' },
      status: { universalIdentifier: 'aeb1e000-0001-4000-800e-aeb1e000e002' },
      referenceName: { universalIdentifier: 'aeb1e000-0001-4000-800e-aeb1e000e003' },
      referenceTitle: { universalIdentifier: 'aeb1e000-0001-4000-800e-aeb1e000e004' },
      referenceOrganization: { universalIdentifier: 'aeb1e000-0001-4000-800e-aeb1e000e005' },
      referenceContact: { universalIdentifier: 'aeb1e000-0001-4000-800e-aeb1e000e006' },
      relationshipType: { universalIdentifier: 'aeb1e000-0001-4000-800e-aeb1e000e007' },
      findings: { universalIdentifier: 'aeb1e000-0001-4000-800e-aeb1e000e008' },
      verifiedAt: { universalIdentifier: 'aeb1e000-0001-4000-800e-aeb1e000e009' },
      verifiedById: { universalIdentifier: 'aeb1e000-0001-4000-800e-aeb1e000e010' },
      searchCandidacy: { universalIdentifier: 'aeb1e000-0001-4000-800e-aeb1e000e011' },
      searchCandidacyId: { universalIdentifier: 'aeb1e000-0001-4000-800e-aeb1e000e012' },
    },
    indexes: {
      searchCandidacyIdIndex: { universalIdentifier: 'aeb1e000-0002-4000-800e-aeb1e000i001' },
      statusIndex: { universalIdentifier: 'aeb1e000-0002-4000-800e-aeb1e000i002' },
    },
    views: {
      referenceCheckRecordPageFields: {
        universalIdentifier: 'aeb1e000-0030-4000-800e-aeb1e000v001',
        viewFieldGroups: {
          general: { universalIdentifier: 'aeb1e000-0040-4000-800e-aeb1e000g001' },
          system: { universalIdentifier: 'aeb1e000-0040-4000-800e-aeb1e000g002' },
        },
        viewFields: {
          name: { universalIdentifier: 'aeb1e000-0050-4000-800e-aeb1e000f001' },
          status: { universalIdentifier: 'aeb1e000-0050-4000-800e-aeb1e000f002' },
          referenceName: { universalIdentifier: 'aeb1e000-0050-4000-800e-aeb1e000f003' },
          referenceTitle: { universalIdentifier: 'aeb1e000-0050-4000-800e-aeb1e000f004' },
          referenceOrganization: { universalIdentifier: 'aeb1e000-0050-4000-800e-aeb1e000f005' },
          relationshipType: { universalIdentifier: 'aeb1e000-0050-4000-800e-aeb1e000f006' },
          findings: { universalIdentifier: 'aeb1e000-0050-4000-800e-aeb1e000f007' },
          searchCandidacy: { universalIdentifier: 'aeb1e000-0050-4000-800e-aeb1e000f008' },
          createdAt: { universalIdentifier: 'aeb1e000-0050-4000-800e-aeb1e000f009' },
          createdBy: { universalIdentifier: 'aeb1e000-0050-4000-800e-aeb1e000f010' },
          verifiedAt: { universalIdentifier: 'aeb1e000-0050-4000-800e-aeb1e000f011' },
        },
      },
    },
  },

  diligenceCheck: {
    universalIdentifier: 'aeb1f000-0001-4000-800f-aeb1f0000001',
    fields: {
      ...buildStandardObjectSystemFields(
        'aeb1f000-0001-4000-800f-aeb1f0000001',
      ),
      name: { universalIdentifier: 'aeb1f000-0001-4000-800f-aeb1f000f001' },
      diligenceType: { universalIdentifier: 'aeb1f000-0001-4000-800f-aeb1f000f002' },
      status: { universalIdentifier: 'aeb1f000-0001-4000-800f-aeb1f000f003' },
      findings: { universalIdentifier: 'aeb1f000-0001-4000-800f-aeb1f000f004' },
      recommendation: { universalIdentifier: 'aeb1f000-0001-4000-800f-aeb1f000f005' },
      conductedAt: { universalIdentifier: 'aeb1f000-0001-4000-800f-aeb1f000f006' },
      conductedById: { universalIdentifier: 'aeb1f000-0001-4000-800f-aeb1f000f007' },
      searchCandidacy: { universalIdentifier: 'aeb1f000-0001-4000-800f-aeb1f000f008' },
      searchCandidacyId: { universalIdentifier: 'aeb1f000-0001-4000-800f-aeb1f000f009' },
    },
    indexes: {
      searchCandidacyIdIndex: { universalIdentifier: 'aeb1f000-0002-4000-800f-aeb1f000i001' },
      statusIndex: { universalIdentifier: 'aeb1f000-0002-4000-800f-aeb1f000i002' },
    },
    views: {
      diligenceCheckRecordPageFields: {
        universalIdentifier: 'aeb1f000-0030-4000-800f-aeb1f000v001',
        viewFieldGroups: {
          general: { universalIdentifier: 'aeb1f000-0040-4000-800f-aeb1f000g001' },
          system: { universalIdentifier: 'aeb1f000-0040-4000-800f-aeb1f000g002' },
        },
        viewFields: {
          name: { universalIdentifier: 'aeb1f000-0050-4000-800f-aeb1f000f001' },
          diligenceType: { universalIdentifier: 'aeb1f000-0050-4000-800f-aeb1f000f002' },
          status: { universalIdentifier: 'aeb1f000-0050-4000-800f-aeb1f000f003' },
          findings: { universalIdentifier: 'aeb1f000-0050-4000-800f-aeb1f000f004' },
          searchCandidacy: { universalIdentifier: 'aeb1f000-0050-4000-800f-aeb1f000f005' },
          createdAt: { universalIdentifier: 'aeb1f000-0050-4000-800f-aeb1f000f006' },
          createdBy: { universalIdentifier: 'aeb1f000-0050-4000-800f-aeb1f000f007' },
        },
      },
    },
  },

  guaranteeCase: {
    universalIdentifier: 'd4d4e5e5-c0e4-4a04-8c04-ac11e0000001',
    fields: {
      ...buildStandardObjectSystemFields(
        'd4d4e5e5-c0e4-4a04-8c04-ac11e0000001',
      ),
      name: { universalIdentifier: 'd4d4e5e5-e001-4a04-8c04-ac11e000e001' },
      status: { universalIdentifier: 'd4d4e5e5-e002-4a04-8c04-ac11e000e002' },
      activeFrom: { universalIdentifier: 'd4d4e5e5-e003-4a04-8c04-ac11e000e003' },
      activeUntil: { universalIdentifier: 'd4d4e5e5-e004-4a04-8c04-ac11e000e004' },
      guaranteeType: { universalIdentifier: 'd4d4e5e5-e005-4a04-8c04-ac11e000e005' },
      claimFiledAt: { universalIdentifier: 'd4d4e5e5-e006-4a04-8c04-ac11e000e006' },
      claimReason: { universalIdentifier: 'd4d4e5e5-e007-4a04-8c04-ac11e000e007' },
      claimAmount: { universalIdentifier: 'd4d4e5e5-e008-4a04-8c04-ac11e000e008' },
      claimCurrencyCode: { universalIdentifier: 'd4d4e5e5-e009-4a04-8c04-ac11e000e009' },
      claimOutcome: { universalIdentifier: 'd4d4e5e5-e00a-4a04-8c04-ac11e000e00a' },
      claimResolvedAt: { universalIdentifier: 'd4d4e5e5-e00b-4a04-8c04-ac11e000e00b' },
      placement: { universalIdentifier: 'd4d4e5e5-e00c-4a04-8c04-ac11e000e00c' },
      placementId: { universalIdentifier: 'd4d4e5e5-e00d-4a04-8c04-ac11e000e00d' },
      replacementPlacement: { universalIdentifier: 'd4d4e5e5-e00e-4a04-8c04-ac11e000e00e' },
      replacementPlacementId: { universalIdentifier: 'd4d4e5e5-e00f-4a04-8c04-ac11e000e00f' },
      searchAssignment: { universalIdentifier: 'd4d4e5e5-e010-4a04-8c04-ac11e000e010' },
      searchAssignmentId: { universalIdentifier: 'd4d4e5e5-e011-4a04-8c04-ac11e000e011' },
    },
    indexes: {
      placementIdIndex: { universalIdentifier: 'd4d4e5e5-f001-4a04-8c04-ac11e000f001' },
      searchAssignmentIdIndex: { universalIdentifier: 'd4d4e5e5-f002-4a04-8c04-ac11e000f002' },
    },
    views: {
      guaranteeCaseRecordPageFields: {
        universalIdentifier: 'd4d4e5e5-d001-4a04-8c04-ac11e000d001',
        viewFieldGroups: {
          general: { universalIdentifier: 'd4d4e5e5-d101-4a04-8c04-ac11e000d101' },
          system: { universalIdentifier: 'd4d4e5e5-d102-4a04-8c04-ac11e000d102' },
        },
        viewFields: {
          name: { universalIdentifier: 'd4d4e5e5-c001-4a04-8c04-ac11e000c001' },
          status: { universalIdentifier: 'd4d4e5e5-c002-4a04-8c04-ac11e000c002' },
          activeFrom: { universalIdentifier: 'd4d4e5e5-c003-4a04-8c04-ac11e000c003' },
          activeUntil: { universalIdentifier: 'd4d4e5e5-c004-4a04-8c04-ac11e000c004' },
          guaranteeType: { universalIdentifier: 'd4d4e5e5-c005-4a04-8c04-ac11e000c005' },
          claimFiledAt: { universalIdentifier: 'd4d4e5e5-c006-4a04-8c04-ac11e000c006' },
          claimAmount: { universalIdentifier: 'd4d4e5e5-c007-4a04-8c04-ac11e000c007' },
          claimCurrencyCode: { universalIdentifier: 'd4d4e5e5-c008-4a04-8c04-ac11e000c008' },
          claimOutcome: { universalIdentifier: 'd4d4e5e5-c009-4a04-8c04-ac11e000c009' },
          placement: { universalIdentifier: 'd4d4e5e5-c00a-4a04-8c04-ac11e000c00a' },
          searchAssignment: { universalIdentifier: 'd4d4e5e5-c00b-4a04-8c04-ac11e000c00b' },
          createdAt: { universalIdentifier: 'd4d4e5e5-c00c-4a04-8c04-ac11e000c00c' },
          createdBy: { universalIdentifier: 'd4d4e5e5-c00d-4a04-8c04-ac11e000c00d' },
        },
      },
    },
  },
  boardCompositionProfile: {
    universalIdentifier: 'f0a1b2c3-0001-4000-8001-f0a1b2c3000001',
    fields: {
      ...buildStandardObjectSystemFields('f0a1b2c3-0001-4000-8001-f0a1b2c3000001'),
      name: { universalIdentifier: 'f0a1b2c3-0101-4000-8001-f0a1b2c301010101' },
      status: { universalIdentifier: 'f0a1b2c3-0102-4000-8001-f0a1b2c301010102' },
      targetBoardType: { universalIdentifier: 'f0a1b2c3-0103-4000-8001-f0a1b2c301010103' },
      industryPreference: { universalIdentifier: 'f0a1b2c3-0104-4000-8001-f0a1b2c301010104' },
      currentSize: { universalIdentifier: 'f0a1b2c3-0105-4000-8001-f0a1b2c301010105' },
      targetSize: { universalIdentifier: 'f0a1b2c3-0106-4000-8001-f0a1b2c301010106' },
      notes: { universalIdentifier: 'f0a1b2c3-0107-4000-8001-f0a1b2c301010107' },
      searchAssignmentId: { universalIdentifier: 'f0a1b2c3-0108-4000-8001-f0a1b2c301010108' },
      searchAssignment: { universalIdentifier: 'f0a1b2c3-0109-4000-8001-f0a1b2c301010109' },
    },
    indexes: { searchVectorGinIndex: { universalIdentifier: 'f0a1b2c3-0901-4000-8001-f0a1b2c3090101' }, searchAssignmentIdIndex: { universalIdentifier: 'f0a1b2c3-0902-4000-8001-f0a1b2c3090102' }, },
    views: {
      allBoardCompositionProfiles: { universalIdentifier: 'f0a1b2c3-0801-4000-8001-f0a1b2c3080101', viewFields: { name: { universalIdentifier: 'f0a1b2c3-0701-4000-8001-f0a1b2c3070101' }, status: { universalIdentifier: 'f0a1b2c3-0702-4000-8001-f0a1b2c3070102' }, targetBoardType: { universalIdentifier: 'f0a1b2c3-0703-4000-8001-f0a1b2c3070103' }, }, viewFieldGroups: { general: { universalIdentifier: 'f0a1b2c3-0803-4000-8001-f0a1b2c3080103' }, }, },
      boardCompositionProfileRecordPageFields: { universalIdentifier: 'f0a1b2c3-0802-4000-8001-f0a1b2c3080102', viewFields: {}, },
    },
  },
  boardMatrixCriterion: {
    universalIdentifier: 'f0a1b2c3-0002-4000-8002-f0a1b2c3000002',
    fields: {
      ...buildStandardObjectSystemFields('f0a1b2c3-0002-4000-8002-f0a1b2c3000002'),
      name: { universalIdentifier: 'f0a1b2c3-0201-4000-8002-f0a1b2c302010101' },
      category: { universalIdentifier: 'f0a1b2c3-0202-4000-8002-f0a1b2c302010102' },
      weight: { universalIdentifier: 'f0a1b2c3-0203-4000-8002-f0a1b2c302010103' },
      description: { universalIdentifier: 'f0a1b2c3-0204-4000-8002-f0a1b2c302010104' },
      isRequired: { universalIdentifier: 'f0a1b2c3-0205-4000-8002-f0a1b2c302010105' },
      boardCompositionProfileId: { universalIdentifier: 'f0a1b2c3-0206-4000-8002-f0a1b2c302010106' },
      boardCompositionProfile: { universalIdentifier: 'f0a1b2c3-0207-4000-8002-f0a1b2c302010107' },
    },
    indexes: { searchVectorGinIndex: { universalIdentifier: 'f0a1b2c3-0903-4000-8002-f0a1b2c3090103' }, boardCompositionProfileIdIndex: { universalIdentifier: 'f0a1b2c3-0904-4000-8002-f0a1b2c3090104' }, },
    views: {
      allBoardMatrixCriteria: { universalIdentifier: 'f0a1b2c3-0804-4000-8002-f0a1b2c3080104', viewFields: { name: { universalIdentifier: 'f0a1b2c3-0704-4000-8002-f0a1b2c3070104' }, category: { universalIdentifier: 'f0a1b2c3-0705-4000-8002-f0a1b2c3070105' }, weight: { universalIdentifier: 'f0a1b2c3-0706-4000-8002-f0a1b2c3070106' }, }, viewFieldGroups: { general: { universalIdentifier: 'f0a1b2c3-0805-4000-8002-f0a1b2c3080105' }, }, },
      boardMatrixCriterionRecordPageFields: { universalIdentifier: 'f0a1b2c3-0806-4000-8002-f0a1b2c3080106', viewFields: {}, },
    },
  },
  candidateBoardMatrixEvaluation: {
    universalIdentifier: 'f0a1b2c3-0003-4000-8003-f0a1b2c3000003',
    fields: {
      ...buildStandardObjectSystemFields('f0a1b2c3-0003-4000-8003-f0a1b2c3000003'),
      score: { universalIdentifier: 'f0a1b2c3-0301-4000-8003-f0a1b2c303010101' },
      maxScore: { universalIdentifier: 'f0a1b2c3-0302-4000-8003-f0a1b2c303010102' },
      notes: { universalIdentifier: 'f0a1b2c3-0303-4000-8003-f0a1b2c303010103' },
      boardMatrixCriterionId: { universalIdentifier: 'f0a1b2c3-0304-4000-8003-f0a1b2c303010104' },
      boardMatrixCriterion: { universalIdentifier: 'f0a1b2c3-0305-4000-8003-f0a1b2c303010105' },
      searchCandidacyId: { universalIdentifier: 'f0a1b2c3-0306-4000-8003-f0a1b2c303010106' },
    },
    indexes: { searchVectorGinIndex: { universalIdentifier: 'f0a1b2c3-0905-4000-8003-f0a1b2c3090105' }, boardMatrixCriterionIdIndex: { universalIdentifier: 'f0a1b2c3-0906-4000-8003-f0a1b2c3090106' }, searchCandidacyIdIndex: { universalIdentifier: 'f0a1b2c3-0907-4000-8003-f0a1b2c3090107' }, },
    views: {
      allCandidateBoardMatrixEvaluations: { universalIdentifier: 'f0a1b2c3-0807-4000-8003-f0a1b2c3080107', viewFields: { score: { universalIdentifier: 'f0a1b2c3-0707-4000-8003-f0a1b2c3070107' }, maxScore: { universalIdentifier: 'f0a1b2c3-0708-4000-8003-f0a1b2c3070108' }, }, viewFieldGroups: { general: { universalIdentifier: 'f0a1b2c3-0808-4000-8003-f0a1b2c3080108' }, }, },
      candidateBoardMatrixEvaluationRecordPageFields: { universalIdentifier: 'f0a1b2c3-0809-4000-8003-f0a1b2c3080109', viewFields: {}, },
    },
  },
  directorIndependenceReview: {
    universalIdentifier: 'f0a1b2c3-0004-4000-8004-f0a1b2c3000004',
    fields: {
      ...buildStandardObjectSystemFields('f0a1b2c3-0004-4000-8004-f0a1b2c3000004'),
      name: { universalIdentifier: 'f0a1b2c3-0401-4000-8004-f0a1b2c304010101' },
      status: { universalIdentifier: 'f0a1b2c3-0402-4000-8004-f0a1b2c304010102' },
      reviewDate: { universalIdentifier: 'f0a1b2c3-0403-4000-8004-f0a1b2c304010103' },
      findings: { universalIdentifier: 'f0a1b2c3-0404-4000-8004-f0a1b2c304010104' },
      reviewerId: { universalIdentifier: 'f0a1b2c3-0405-4000-8004-f0a1b2c304010105' },
      searchCandidacyId: { universalIdentifier: 'f0a1b2c3-0406-4000-8004-f0a1b2c304010106' },
    },
    indexes: { searchVectorGinIndex: { universalIdentifier: 'f0a1b2c3-0908-4000-8004-f0a1b2c3090108' }, searchCandidacyIdIndex: { universalIdentifier: 'f0a1b2c3-0909-4000-8004-f0a1b2c3090109' }, },
    views: {
      allDirectorIndependenceReviews: { universalIdentifier: 'f0a1b2c3-0810-4000-8004-f0a1b2c3080110', viewFields: { name: { universalIdentifier: 'f0a1b2c3-0709-4000-8004-f0a1b2c3070109' }, status: { universalIdentifier: 'f0a1b2c3-0710-4000-8004-f0a1b2c3070110' }, reviewDate: { universalIdentifier: 'f0a1b2c3-0711-4000-8004-f0a1b2c3070111' }, }, viewFieldGroups: { general: { universalIdentifier: 'f0a1b2c3-0811-4000-8004-f0a1b2c3080111' }, }, },
      directorIndependenceReviewRecordPageFields: { universalIdentifier: 'f0a1b2c3-0812-4000-8004-f0a1b2c3080112', viewFields: {}, },
    },
  },
  boardCommitmentReview: {
    universalIdentifier: 'f0a1b2c3-0005-4000-8005-f0a1b2c3000005',
    fields: {
      ...buildStandardObjectSystemFields('f0a1b2c3-0005-4000-8005-f0a1b2c3000005'),
      name: { universalIdentifier: 'f0a1b2c3-0501-4000-8005-f0a1b2c305010101' },
      status: { universalIdentifier: 'f0a1b2c3-0502-4000-8005-f0a1b2c305010102' },
      reviewDate: { universalIdentifier: 'f0a1b2c3-0503-4000-8005-f0a1b2c305010103' },
      currentBoardCount: { universalIdentifier: 'f0a1b2c3-0504-4000-8005-f0a1b2c305010104' },
      currentChairCount: { universalIdentifier: 'f0a1b2c3-0505-4000-8005-f0a1b2c305010105' },
      totalCommitmentHoursEstimate: { universalIdentifier: 'f0a1b2c3-0506-4000-8005-f0a1b2c305010106' },
      findings: { universalIdentifier: 'f0a1b2c3-0507-4000-8005-f0a1b2c305010107' },
      searchCandidacyId: { universalIdentifier: 'f0a1b2c3-0508-4000-8005-f0a1b2c305010108' },
    },
    indexes: { searchVectorGinIndex: { universalIdentifier: 'f0a1b2c3-0910-4000-8005-f0a1b2c3090110' }, searchCandidacyIdIndex: { universalIdentifier: 'f0a1b2c3-0911-4000-8005-f0a1b2c3090111' }, },
    views: {
      allBoardCommitmentReviews: { universalIdentifier: 'f0a1b2c3-0813-4000-8005-f0a1b2c3080113', viewFields: { name: { universalIdentifier: 'f0a1b2c3-0712-4000-8005-f0a1b2c3070112' }, status: { universalIdentifier: 'f0a1b2c3-0713-4000-8005-f0a1b2c3070113' }, reviewDate: { universalIdentifier: 'f0a1b2c3-0714-4000-8005-f0a1b2c3070114' }, }, viewFieldGroups: { general: { universalIdentifier: 'f0a1b2c3-0814-4000-8005-f0a1b2c3080114' }, }, },
      boardCommitmentReviewRecordPageFields: { universalIdentifier: 'f0a1b2c3-0815-4000-8005-f0a1b2c3080115', viewFields: {}, },
    },
  },
analyticsDomainMetric: {
    universalIdentifier: 'aeb1a006-0001-4000-8001-000000000001',
    fields: {
      ...buildStandardObjectSystemFields('aeb1a006-0001-4000-8001-000000000001'),
      name: { universalIdentifier: 'aeb1a006-0101-4000-8001-000000000101' },
      code: { universalIdentifier: 'aeb1a006-0102-4000-8001-000000000102' },
      description: { universalIdentifier: 'aeb1a006-0103-4000-8001-000000000103' },
      category: { universalIdentifier: 'aeb1a006-0104-4000-8001-000000000104' },
      aggregationType: { universalIdentifier: 'aeb1a006-0105-4000-8001-000000000105' },
      valueType: { universalIdentifier: 'aeb1a006-0106-4000-8001-000000000106' },
      timeWindow: { universalIdentifier: 'aeb1a006-0107-4000-8001-000000000107' },
      sourceObject: { universalIdentifier: 'aeb1a006-0108-4000-8001-000000000108' },
      computationDescription: { universalIdentifier: 'aeb1a006-0109-4000-8001-000000000109' },
      unit: { universalIdentifier: 'aeb1a006-0110-4000-8001-000000000110' },
      status: { universalIdentifier: 'aeb1a006-0111-4000-8001-000000000111' },
      isConfidential: { universalIdentifier: 'aeb1a006-0112-4000-8001-000000000112' },
      tags: { universalIdentifier: 'aeb1a006-0113-4000-8001-000000000113' },
      ownerWorkspaceMemberId: { universalIdentifier: 'aeb1a006-0114-4000-8001-000000000114' },
      ownerWorkspaceMember: { universalIdentifier: 'aeb1a006-0115-4000-8001-000000000115' },
      snapshots: { universalIdentifier: 'aeb1a006-0116-4000-8001-000000000116' },
    },
    indexes: {
      searchVectorGinIndex: { universalIdentifier: 'aeb1a006-0901-4000-8001-000000000901' },
      codeIndex: { universalIdentifier: 'aeb1a006-0902-4000-8001-000000000902' },
      categoryIndex: { universalIdentifier: 'aeb1a006-0903-4000-8001-000000000903' },
      statusIndex: { universalIdentifier: 'aeb1a006-0904-4000-8001-000000000904' },
    },
    views: {
      allAnalyticsDomainMetrics: {
        universalIdentifier: 'aeb1a006-0801-4000-8001-000000000801',
        viewFields: {
          name: { universalIdentifier: 'aeb1a006-0701-4000-8001-000000000701' },
          code: { universalIdentifier: 'aeb1a006-0702-4000-8001-000000000702' },
          category: { universalIdentifier: 'aeb1a006-0703-4000-8001-000000000703' },
        },
        viewFieldGroups: { general: { universalIdentifier: 'aeb1a006-0803-4000-8001-000000000803' }, },
      },
      analyticsDomainMetricRecordPageFields: {
        universalIdentifier: 'aeb1a006-0802-4000-8001-000000000802',
        viewFields: {},
      },
    },
  },
  analyticsMetricSnapshot: {
    universalIdentifier: 'aeb1a006-0002-4000-8001-000000000002',
    fields: {
      ...buildStandardObjectSystemFields('aeb1a006-0002-4000-8001-000000000002'),
      name: { universalIdentifier: 'aeb1a006-0201-4000-8001-000000000201' },
      metricId: { universalIdentifier: 'aeb1a006-0202-4000-8001-000000000202' },
      metric: { universalIdentifier: 'aeb1a006-0203-4000-8001-000000000203' },
      periodStart: { universalIdentifier: 'aeb1a006-0204-4000-8001-000000000204' },
      periodEnd: { universalIdentifier: 'aeb1a006-0205-4000-8001-000000000205' },
      periodLabel: { universalIdentifier: 'aeb1a006-0206-4000-8001-000000000206' },
      granularity: { universalIdentifier: 'aeb1a006-0207-4000-8001-000000000207' },
      value: { universalIdentifier: 'aeb1a006-0208-4000-8001-000000000208' },
      valueText: { universalIdentifier: 'aeb1a006-0209-4000-8001-000000000209' },
      previousValue: { universalIdentifier: 'aeb1a006-0210-4000-8001-000000000210' },
      delta: { universalIdentifier: 'aeb1a006-0211-4000-8001-000000000211' },
      deltaPercent: { universalIdentifier: 'aeb1a006-0212-4000-8001-000000000212' },
      targetValue: { universalIdentifier: 'aeb1a006-0213-4000-8001-000000000213' },
      dimensions: { universalIdentifier: 'aeb1a006-0214-4000-8001-000000000214' },
      sourceCount: { universalIdentifier: 'aeb1a006-0215-4000-8001-000000000215' },
      computedAt: { universalIdentifier: 'aeb1a006-0216-4000-8001-000000000216' },
      computationStatus: { universalIdentifier: 'aeb1a006-0217-4000-8001-000000000217' },
      computationNotes: { universalIdentifier: 'aeb1a006-0218-4000-8001-000000000218' },
      computedById: { universalIdentifier: 'aeb1a006-0219-4000-8001-000000000219' },
      computedBy: { universalIdentifier: 'aeb1a006-0220-4000-8001-000000000220' },
    },
    indexes: {
      searchVectorGinIndex: { universalIdentifier: 'aeb1a006-0905-4000-8001-000000000905' },
      metricIdIndex: { universalIdentifier: 'aeb1a006-0906-4000-8001-000000000906' },
      periodStartIndex: { universalIdentifier: 'aeb1a006-0907-4000-8001-000000000907' },
      periodEndIndex: { universalIdentifier: 'aeb1a006-0908-4000-8001-000000000908' },
      granularityIndex: { universalIdentifier: 'aeb1a006-0909-4000-8001-000000000909' },
      computationStatusIndex: { universalIdentifier: 'aeb1a006-0910-4000-8001-000000000910' },
    },
    views: {
      allAnalyticsMetricSnapshots: {
        universalIdentifier: 'aeb1a006-0804-4000-8001-000000000804',
        viewFields: {
          name: { universalIdentifier: 'aeb1a006-0704-4000-8001-000000000704' },
          value: { universalIdentifier: 'aeb1a006-0705-4000-8001-000000000705' },
          computationStatus: { universalIdentifier: 'aeb1a006-0706-4000-8001-000000000706' },
        },
        viewFieldGroups: { general: { universalIdentifier: 'aeb1a006-0806-4000-8001-000000000806' }, },
      },
      analyticsMetricSnapshotRecordPageFields: {
        universalIdentifier: 'aeb1a006-0805-4000-8001-000000000805',
        viewFields: {},
      },
    },
  },
  analyticsDashboardConfig: {
    universalIdentifier: 'aeb1a006-0003-4000-8001-000000000003',
    fields: {
      ...buildStandardObjectSystemFields('aeb1a006-0003-4000-8001-000000000003'),
      name: { universalIdentifier: 'aeb1a006-0301-4000-8001-000000000301' },
      description: { universalIdentifier: 'aeb1a006-0302-4000-8001-000000000302' },
      scope: { universalIdentifier: 'aeb1a006-0303-4000-8001-000000000303' },
      audience: { universalIdentifier: 'aeb1a006-0304-4000-8001-000000000304' },
      metricCodes: { universalIdentifier: 'aeb1a006-0305-4000-8001-000000000305' },
      layout: { universalIdentifier: 'aeb1a006-0306-4000-8001-000000000306' },
      filters: { universalIdentifier: 'aeb1a006-0307-4000-8001-000000000307' },
      defaultTimeRange: { universalIdentifier: 'aeb1a006-0308-4000-8001-000000000308' },
      refreshFrequency: { universalIdentifier: 'aeb1a006-0309-4000-8001-000000000309' },
      isShared: { universalIdentifier: 'aeb1a006-0310-4000-8001-000000000310' },
      status: { universalIdentifier: 'aeb1a006-0311-4000-8001-000000000311' },
      ownerWorkspaceMemberId: { universalIdentifier: 'aeb1a006-0312-4000-8001-000000000312' },
      ownerWorkspaceMember: { universalIdentifier: 'aeb1a006-0313-4000-8001-000000000313' },
    },
    indexes: {
      searchVectorGinIndex: { universalIdentifier: 'aeb1a006-0911-4000-8001-000000000911' },
      scopeIndex: { universalIdentifier: 'aeb1a006-0912-4000-8001-000000000912' },
      audienceIndex: { universalIdentifier: 'aeb1a006-0913-4000-8001-000000000913' },
      statusIndex: { universalIdentifier: 'aeb1a006-0914-4000-8001-000000000914' },
      ownerWorkspaceMemberIdIndex: { universalIdentifier: 'aeb1a006-0915-4000-8001-000000000915' },
    },
    views: {
      allAnalyticsDashboardConfigs: {
        universalIdentifier: 'aeb1a006-0807-4000-8001-000000000807',
        viewFields: {
          name: { universalIdentifier: 'aeb1a006-0707-4000-8001-000000000707' },
          scope: { universalIdentifier: 'aeb1a006-0708-4000-8001-000000000708' },
          audience: { universalIdentifier: 'aeb1a006-0709-4000-8001-000000000709' },
        },
        viewFieldGroups: { general: { universalIdentifier: 'aeb1a006-0809-4000-8001-000000000809' }, },
      },
      analyticsDashboardConfigRecordPageFields: {
        universalIdentifier: 'aeb1a006-0808-4000-8001-000000000808',
        viewFields: {},
      },
    },
  },
} as const satisfies Record<
  string,
  {
    universalIdentifier: string;
    morphIds?: Record<string, { morphId: string }>;
    fields: Record<string, { universalIdentifier: string }>;
    indexes: Record<string, { universalIdentifier: string }>;
    views?: Record<
      string,
      {
        universalIdentifier: string;
        viewFields: Record<string, { universalIdentifier: string }>;
        viewFieldGroups?: Record<string, { universalIdentifier: string }>;
        viewFilters?: Record<string, { universalIdentifier: string }>;
        viewGroups?: Record<string, { universalIdentifier: string }>;
      }
    >;
  }
>;
