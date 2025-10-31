# TODO: Fix Zod Schema Errors in lib/schema.ts

## Steps to Complete
- [x] Edit lib/schema.ts to remove invalid 'required_error' and 'invalid_type_error' properties from all z.string() calls
- [ ] Adjust z.string() calls to use proper Zod syntax: change 'required_error' to 'message' and remove 'invalid_type_error'
- [ ] Verify no TypeScript errors remain
- [ ] Test the schemas if possible

## Progress
- Started: [Current Date/Time]
- Completed: Edited CategoryFormSchema
