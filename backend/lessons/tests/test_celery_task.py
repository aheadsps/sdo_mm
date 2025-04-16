from django.test import TestCase
from djcelery.models import TaskState
from myapp.tasks import add


TEST_RUNNER = 'djcelery.contrib.test_runner.' \
    'CeleryTestSuiteRunnerStoringResult'

class AddTestCase(TestCase):

    def testNoError(self):
        """Test that the ``add`` task runs with no errors,
        and returns the correct result."""
        result = add.delay(8, 8)

        self.assertEquals(result.get(), 16)
        self.assertTrue(result.successful())

        # Run another task
        add.delay(4, 4)

        # Assert we have 2 task results in the test database
        self.assertEqual(TaskState.objects.count(), 2)

        # Assert results
        self.assertEqual([task_state.result for task_state
                          in TaskState.objects.all()], [16, 8])